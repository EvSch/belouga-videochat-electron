/* global __dirname, process */

const {
    BrowserWindow,
    Menu,
    app,
    ipcMain,
    nativeTheme,
    session
} = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const debug = (() => (
  isDev ? require('electron-debug') : null
))();
const ProgressBar = require('electron-progressbar');
const { autoUpdater } = require('electron-differential-updater');
const windowStateKeeper = require('electron-window-state');
const {
    initPopupsConfigurationMain,
    getPopupTarget,
    setupAlwaysOnTopMain,
    setupPowerMonitorMain,
    setupScreenSharingMain
} = require('jitsi-meet-electron-utils');
const path = require('path');
const URLN = require('url');
const config = require('./app/features/config');
const { openExternalLink } = require('./app/features/utils/openExternalLink');
const pkgJson = require('./package.json');
let urlInfo = {};
let skipURLCheck = false;

const showDevTools = Boolean(process.env.SHOW_DEV_TOOLS) || (process.argv.indexOf('--show-dev-tools') > -1) || isDev;

// We need this because of https://github.com/electron/electron/issues/18214
app.commandLine.appendSwitch('disable-site-isolation-trials');

// Needed until robot.js is fixed: https://github.com/octalmage/robotjs/issues/580
app.allowRendererProcessReuse = false;

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'debug';
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;
// Enable context menu so things like copy and paste work in input fields.
contextMenu({
    showLookUpSelection: false,
    showSearchWithGoogle: false,
    showCopyImage: false,
    showCopyImageAddress: false,
    showSaveImage: false,
    showSaveImageAs: false,
    showInspectElement: showDevTools,
    showServices: false
});

/**
 * When in development mode:
 * - Enable automatic reloads
 */
if (isDev) {
    debug({
      isEnabled: true,
      showDevTools
    });
    require('electron-reload')(path.join(__dirname, 'build'));
}

/**
 * The window object that will load the iframe with Jitsi Meet.
 * IMPORTANT: Must be defined as global in order to not be garbage collected
 * acidentally.
 */
let mainWindow = null;

/**
 * Add protocol data
 */
const appProtocolSurplus = `${config.default.appProtocolPrefix}://`;
let rendererReady = false;
let protocolDataForFrontApp = null;
let firstLaunch = true;


/**
 * Sets the application menu. It is hidden on all platforms except macOS because
 * otherwise copy and paste functionality is not available.
 */
function setApplicationMenu() {
    if (process.platform === 'darwin') {
        const template = [ {
            label: app.name,
            submenu: [
                {
                    role: 'services',
                    submenu: []
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }, {
            label: 'Edit',
            submenu: [ {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                selector: 'selectAll:'
            } ]
        }, {
            label: '&Window',
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        } ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    } else {
        Menu.setApplicationMenu(null);
    }
}

function launchMainWindow(mainWindow, indexURL) {
    mainWindow.loadURL(indexURL);
    initPopupsConfigurationMain(mainWindow);
    setupAlwaysOnTopMain(mainWindow);
    setupPowerMonitorMain(mainWindow);
    setupScreenSharingMain(mainWindow, config.default.appName, pkgJson.build.appId);
}

/**
 * Opens new window with index.html(Jitsi Meet is loaded in iframe there).
 */
async function createJitsiMeetWindow() {
    // Application menu.
    setApplicationMenu();

    // Check for Updates.
    //autoUpdater.checkForUpdatesAndNotify();

    // Load the previous window state with fallback to defaults.
    const windowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    // Path to root directory.
    const basePath = isDev ? __dirname : app.getAppPath();

    // URL for index.html which will be our entry point.
    const indexURL = URLN.format({
        pathname: path.resolve(basePath, './build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // Options used when creating the main Jitsi Meet window.
    // Use a preload script in order to provide node specific functionality
    // to a isolated BrowserWindow in accordance with electron security
    // guideline.
    const options = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        icon: path.resolve(basePath, './resources/icons/icon_512x512.png'),
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            enableBlinkFeatures: 'RTCInsertableStreams',
            enableRemoteModule: true,
            nativeWindowOpen: true,
            nodeIntegration: false,
            preload: path.resolve(basePath, './build/preload.js')
        }
    };

    mainWindow = new BrowserWindow(options);
    windowState.manage(mainWindow);

    mainWindow.webContents.on('new-window', (event, url, frameName) => {
        const target = getPopupTarget(url, frameName);

        if (!target || target === 'browser') {
            event.preventDefault();
            openExternalLink(url);
        }
    });

    session.defaultSession.webRequest.onBeforeRequest(async (details, callback) => {
      if (!skipURLCheck && details.resourceType == 'subFrame') {
        if (details.url.includes('#')) {
          const reLoaded = await mainWindow.webContents
                .executeJavaScript(`(conferenceEl._owner.stateNode.state.reLoaded)`, true);
          if (reLoaded) {
            console.log("WE RELOADED");
            mainWindow.webContents
                  .executeJavaScript(`(conferenceEl._owner.stateNode.reloadConference())`, true);
            return callback({cancel: true});
          }
          console.log(details);
          const hashProps = details.url.split("#").pop();
          const params = {};
          hashProps.split('&').forEach(item => {
            params[item.split('=')[0]] = item.split('=')[1];
          });
          const currentProp = await mainWindow.webContents
                .executeJavaScript('(localStorage.getItem("extraProps"));', true);
          await mainWindow.webContents
                .executeJavaScript('(localStorage.removeItem("extraProps"));', true);
          if (Object.keys(urlInfo).length === 0) {
            console.log("Settings first");
            urlInfo = params;
          }
          if (params.jitsi_meet_external_api_id !== undefined && urlInfo.jitsi_meet_external_api_id !== params.jitsi_meet_external_api_id) {
            urlInfo.jitsi_meet_external_api_id = params.jitsi_meet_external_api_id;
          }
          console.log(params);
          const currentUrlInfo = {...urlInfo, ...params};
          if (currentProp !== null) {
            currentUrlInfo[currentProp.split('=')[0]] = currentProp.split('=')[1];
          }
          const newUrlParams = new URLSearchParams(currentUrlInfo).toString();
          const newUrl = new URL(details.url);
          newUrl.hash = '#' + newUrlParams;
          console.log(newUrl.toString());
          skipURLCheck = true;
          mainWindow.webContents
                .executeJavaScript(`(document.querySelector("iframe").src = "${newUrl.toString()}");(conferenceEl._owner.stateNode.updateIFrame())`, true);
          return callback({cancel: true});
        }
      }
      skipURLCheck = false;
      callback({});
    })

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (firstLaunch) {
      firstLaunch = false;
      const progressBarOpts = {
        indeterminate: false,
        text: 'Checking for update...',
        title: 'Belouga Live Auto-Update',
        detail: 'Belouga Live Auto-Update',
        closeOnComplete: false,
        style: {
          value: {'background-color': '#00bbf1'}
        },
        browserWindow: {
          icon: path.resolve(basePath, './resources/icon.ico'), // path to the icon file
          webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true
          },
          vibrancy: 'popover',
          visualEffectState: 'active',
          show: false
        }
      };
      if (process.platform == 'darwin') {
        progressBarOpts.style = {
          text: {color: '#00bbf1'},
          detail: {color: '#00bbf1'},
          value: {'background-color': '#00bbf1'}
        };
      }
      var progressBar = new ProgressBar(progressBarOpts);
      progressBar
      .on('ready', function() {
        if (process.platform == 'darwin') {
          var colorAlpha = nativeTheme.shouldUseDarkColors ? '#00000040' : '#ffffff80';
          progressBar._window.webContents.insertCSS('body {background-color: ' + colorAlpha + ';}');
        }
      })
      .on('completed', function() {
        progressBar.text = 'Update downloaded! Installing...';
        console.info(`completed...`);
      })
      .on('aborted', function(value) {
        console.info(`aborted... ${value}`);
        mainWindow.setProgressBar(-1);
        launchMainWindow(mainWindow, indexURL);
      });

      autoUpdater.on('update-not-available', () => {
        progressBar.close();
      });

      autoUpdater.on('update-available', (updateInfo) => {
        progressBar._window.show();
        progressBar.text = 'Update found! Starting download...';
        autoUpdater.downloadUpdate();
      });

      autoUpdater.on('download-progress', (progressInfo) => {
        progressBar.text = 'Downloading Update...';
        progressBar.value = progressInfo.percent;
        if (progressInfo.hasOwnProperty('isDiff')) {
          progressBar.detail = `${progressInfo.transferred} of ${progressInfo.total} updates downloaded`;
        } else {
          progressBar.detail = `${(progressInfo.transferred/1000000).toFixed(1)}M of ${(progressInfo.total/1000000).toFixed(1)}M downloaded at ${(progressInfo.bytesPerSecond/1024).toFixed(0)}KB/s`;
        }
      });

      autoUpdater.on('update-downloaded', (updateInfo) => {
        progressBar.close();
        setImmediate(() => autoUpdater.quitAndInstall(true, true));
      });


      await autoUpdater.checkForUpdates().catch((e) => {
        progressBar.close()
      });

    } else {
      launchMainWindow(mainWindow, indexURL);
    }

    /**
     * When someone tries to enter something like jitsi-meet://test
     *  while app is closed
     * it will trigger this event below
     */
    handleProtocolCall(process.argv.pop());
}

/**
 * Handler for application protocol links to initiate a conference.
 */
function handleProtocolCall(fullProtocolCall) {
    // don't touch when something is bad
    if (
        !fullProtocolCall
        || fullProtocolCall.trim() === ''
        || fullProtocolCall.indexOf(appProtocolSurplus) !== 0
    ) {
        return;
    }

    const inputURL = fullProtocolCall.replace(appProtocolSurplus, '');

    if (app.isReady() && mainWindow === null) {
        createJitsiMeetWindow();
    }

    protocolDataForFrontApp = inputURL;

    if (rendererReady) {
        mainWindow
            .webContents
            .send('protocol-data-msg', inputURL);
    }
}

/**
 * Force Single Instance Application.
 */
const gotInstanceLock = app.requestSingleInstanceLock();

if (!gotInstanceLock) {
    app.quit();
    process.exit(0);
}

/**
 * Run the application.
 */

app.on('activate', () => {
    if (mainWindow === null) {
        createJitsiMeetWindow();
    }
});

app.on('certificate-error',
    // eslint-disable-next-line max-params
    (event, webContents, url, error, certificate, callback) => {
        if (isDev) {
            event.preventDefault();
            callback(true);
        } else {
            callback(false);
        }
    }
);

app.on('ready', createJitsiMeetWindow);

app.on('second-instance', (event, commandLine) => {
    /**
     * If someone creates second instance of the application, set focus on
     * existing window.
     */
    if (mainWindow) {
        mainWindow.isMinimized() && mainWindow.restore();
        mainWindow.focus();

        /**
         * This is for windows [win32]
         * so when someone tries to enter something like jitsi-meet://test
         * while app is opened it will trigger protocol handler.
         */
        handleProtocolCall(commandLine.pop());
    }
});

app.on('window-all-closed', () => {
    // Don't quit the application on macOS.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient(config.default.appProtocolPrefix);

// If we are running a non-packaged version of the app && on windows
if (isDev && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient(
        config.default.appProtocolPrefix,
        process.execPath,
        [ path.resolve(process.argv[1]) ]
    );
} else {
    app.setAsDefaultProtocolClient(config.default.appProtocolPrefix);
}

/**
 * This is for mac [darwin]
 * so when someone tries to enter something like jitsi-meet://test
 * it will trigger this event below
 */
app.on('open-url', (event, data) => {
    event.preventDefault();
    handleProtocolCall(data);
});

/**
 * This is to notify main.js [this] that front app is ready to receive messages.
 */
ipcMain.on('renderer-ready', () => {
    rendererReady = true;
    if (protocolDataForFrontApp) {
        mainWindow
            .webContents
            .send('protocol-data-msg', protocolDataForFrontApp);
    }
});
