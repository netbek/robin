const fs = require('fs-extra');

module.exports = function(filePath, checkExists = false) {
  if (checkExists && !fs.existsSync(filePath)) {
    return;
  }
  delete require.cache[require.resolve(filePath)];
  return require(filePath);
};
