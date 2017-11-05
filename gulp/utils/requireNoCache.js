var fs = require('fs-extra');

module.exports = function requireNoCache(filePath, checkExists) {
  if (checkExists && !fs.existsSync(filePath)) {
    return;
  }
  delete require.cache[require.resolve(filePath)];
  return require(filePath);
};
