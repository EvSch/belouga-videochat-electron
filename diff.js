const { generateZipandBlockmap } = require('electron-differential-updater');

exports.default = function generateDiff(buildResult) {
  console.log(buildResult);
  generateZipandBlockmap();
};
