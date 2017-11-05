function resolve(filePath) {
  return path.join(__dirname, '../../', filePath);
}

var path = require('path');
var _ = require('lodash');
var fs = require('fs-extra');
var Promise = require('bluebird');
var requireNoCache = require(resolve('gulp/utils/requireNoCache'));

Promise.promisifyAll(fs);

// https://github.com/petkaantonov/bluebird/issues/418#issuecomment-68279389
fs.existsAsync = Promise.promisify(function exists2(path, exists2callback) {
  fs.exists(path, function callbackWrapper(exists) {
    exists2callback(null, exists);
  });
});

var gulpConfig = require(resolve('gulp/config'));

module.exports = function loadViewData(view) {
  var dataFile = path.join(gulpConfig.src.views, view, 'data.js');
  var dataDir = path.join(gulpConfig.src.views, view, 'data');

  return fs.existsAsync(dataFile).then(function(exists) {
    if (exists) {
      var result = requireNoCache(resolve(dataFile));

      return Promise.resolve(result);
    }

    return fs.existsAsync(dataDir).then(function(exists) {
      if (exists) {
        return fs
          .readdirAsync(dataDir)
          .then(function(files) {
            return Promise.mapSeries(files, function(file) {
              var extname = path.extname(file);
              var basename = path.basename(file, extname);
              var filePath = path.join(dataDir, file);
              var result = [basename, requireNoCache(resolve(filePath))];

              return Promise.resolve(result);
            });
          })
          .then(function(data) {
            var keys = data.map(function(d) {
              return d[0];
            });
            var values = data.map(function(d) {
              return d[1];
            });
            var result = _.zipObject(keys, values);

            return Promise.resolve(result);
          });
      }

      return Promise.resolve({});
    });
  });
};
