const path = require('path');
const resolve = function(filePath) {
  return path.join(__dirname, '../../', filePath);
};
const _ = require('lodash');
const fs = require('fs-extra');
const loadViewData = require(resolve('gulp/utils/loadViewData'));
const nunjucks = require('nunjucks');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

// https://github.com/petkaantonov/bluebird/issues/418#issuecomment-68279389
fs.existsAsync = Promise.promisify(function exists2(path, exists2callback) {
  fs.exists(path, function callbackWrapper(exists) {
    exists2callback(null, exists);
  });
});

const gulpConfig = require(resolve('gulp/config'));

nunjucks.configure({
  noCache: true
});

module.exports = function(view) {
  loadViewData(view).then(function(data) {
    const context = {
      data: _.fromPairs(
        _.map(_.keys(data), function(key) {
          return [key, JSON.stringify(data[key])];
        })
      )
    };

    const srcPath = path.join(gulpConfig.src.views, view, 'index.njk');
    const extname = path.extname(srcPath);
    const basename = path.basename(srcPath, extname);
    const distPath = path.join(gulpConfig.dist.base, basename + '.html');
    const html = nunjucks.render(resolve(srcPath), context);

    return fs.outputFileAsync(resolve(distPath), html, 'utf-8');
  });
};
