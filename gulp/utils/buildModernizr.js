const path = require('path');
const resolve = function(filePath) {
  return path.join(__dirname, '../../', filePath);
};
const fs = require('fs-extra');
const modernizr = require('modernizr');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

const gulpConfig = require(resolve('gulp/config'));

module.exports = function(config) {
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
