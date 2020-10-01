const { notarize } = require('electron-notarize');
const moment = require('moment');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  const startTime = new moment();
  console.log("Notarizing app for OS X");
  const appName = context.packager.appInfo.productFilename;
  const done = await notarize({
    appBundleId: 'org.belouga.live',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'alex@belouga.org',
    appleIdPassword: `@keychain:AC_PASSWORD`
  });
  const finTime = new moment();
  const totalTime = moment.duration(startTime.diff(finTime)).humanize();
  console.log("Notarization completed in: " + totalTime);
  return done;
};
