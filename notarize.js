const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  console.log("Notarizing app for OS X");
  const appName = context.packager.appInfo.productFilename;
  return await notarize({
    appBundleId: 'org.belouga.live',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'alex@belouga.org',
    appleIdPassword: `@keychain:AC_PASSWORD`
  });
};
