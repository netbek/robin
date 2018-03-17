const path = require('path');
const resolve = function(filePath) {
  return path.join(__dirname, '../../', filePath);
};
const _ = require('lodash');
const fs = require('fs-extra');
const Promise = require('bluebird');
const requireNoCache = require(resolve('gulp/utils/requireNoCache'));

Promise.promisifyAll(fs);

// https://github.com/petkaantonov/bluebird/issues/418#issuecomment-68279389
fs.existsAsync = Promise.promisify(function exists2(path, exists2callback) {
  fs.exists(path, function callbackWrapper(exists) {
    exists2callback(null, exists);
  });
});

const gulpConfig = require(resolve('gulp/config'));

module.exports = function(view) {
  const dataFile = path.join(gulpConfig.src.views, view, 'data.js');
  const dataDir = path.join(gulpConfig.src.views, view, 'data');

  return fs.existsAsync(dataFile).then(function(exists) {
    if (exists) {
      const result = requireNoCache(resolve(dataFile));

      return Promise.resolve(result);
    }

    return fs.existsAsync(dataDir).then(function(exists) {
      if (exists) {
        return fs
          .readdirAsync(dataDir)
          .then(function(files) {
            return Promise.mapSeries(files, function(file) {
              const extname = path.extname(file);
              const basename = path.basename(file, extname);
              const filePath = path.join(dataDir, file);
              const result = [basename, requireNoCache(resolve(filePath))];

              return Promise.resolve(result);
            });
          })
          .then(function(data) {
            const keys = data.map(function(d) {
              return d[0];
            });
            const values = data.map(function(d) {
              return d[1];
            });
            const result = _.zipObject(keys, values);

            return Promise.resolve(result);
          });
      }

      return Promise.resolve({});
    });
  });
};
