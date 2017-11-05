function resolve(filePath) {
  return path.join(__dirname, '../../', filePath);
}

var path = require('path');
var fs = require('fs-extra');
var modernizr = require('modernizr');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

var gulpConfig = require(resolve('gulp/config'));

module.exports = function buildModernizr(config) {
  return new Promise(function(resolve) {
    modernizr.build(config, function(result) {
      resolve(result);
    });
  }).then(function(data) {
    return fs.outputFileAsync(
      resolve(path.join(gulpConfig.dist.vendor, 'modernizr/modernizr.js')),
      data,
      'utf-8'
    );
  });
};
