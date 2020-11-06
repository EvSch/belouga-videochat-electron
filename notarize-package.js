const { notarize } = require('electron-notarize');
const { execSync } = require('child_process');
const { generateZipandBlockmap } = require('electron-differential-updater');
const util = require("util");
const moment = require('moment');

exports.default = async function notarizing(context) {
  const {file, target, packager} = context;
  if (packager.platform.name === 'mac' && target.name === 'pkg') {
    console.log("This is an installer package!");
    execSync(`productsign --sign "85DBC057637AA6F6363715ED72541600C3F3644A" ${file} ${target.outDir}/belouga-live-signed.pkg`);
    console.log("Installer signed!");
    execSync(`mv ${target.outDir}/belouga-live-signed.pkg ${target.outDir}/belouga-live.pkg`);
    console.log("Package moved!");

    const startTime = new moment();
    console.log("Notarization started!");
    await notarize({
      appBundleId: 'org.belouga.live',
      appPath: `${target.outDir}/belouga-live.pkg`,
      appleId: 'alex@belouga.org',
      appleIdPassword: `@keychain:AC_PASSWORD`
    });
    const finTime = new moment();
    const totalTime = moment.duration(startTime.diff(finTime)).humanize();
    console.log("Notarization completed in: " + totalTime);
    execSync(`stapler staple ${target.outDir}/belouga-live.pkg`);
  } else if (packager.platform.name === 'mac' && target.name === 'zip') {
    console.log("Old zip props:");
    console.log(context.updateInfo);
    console.log("Generating new Zip!");
    await generateZipandBlockmap();
    console.log("Overwriting zip file name!");
    execSync(`mv "${target.outDir}/Belouga Live-${packager.appInfo.version}-mac.zip" ${target.outDir}/belouga-live.zip`);
    console.log("Renaming zip blockfile!");
    execSync(`mv "${target.outDir}/Belouga Live-${packager.appInfo.version}-mac.zip.blockmap" ${target.outDir}/belouga-live.zip.blockmap`);
  } else {
    return;
  }

};
