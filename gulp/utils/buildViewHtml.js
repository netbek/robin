function resolve(filePath) {
  return path.join(__dirname, '../../', filePath);
}

var path = require('path');
var _ = require('lodash');
var fs = require('fs-extra');
var loadViewData = require(resolve('gulp/utils/loadViewData'));
var nunjucks = require('nunjucks');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

// https://github.com/petkaantonov/bluebird/issues/418#issuecomment-68279389
fs.existsAsync = Promise.promisify(function exists2(path, exists2callback) {
  fs.exists(path, function callbackWrapper(exists) {
    exists2callback(null, exists);
  });
});

var gulpConfig = require(resolve('gulp/config'));

nunjucks.configure({
  noCache: true
});

module.exports = function buildViewHtml(view) {
  loadViewData(view).then(function(data) {
    var context = {
      data: _.fromPairs(
        _.map(_.keys(data), function(key) {
          return [key, JSON.stringify(data[key])];
        })
      )
    };

    var srcPath = path.join(gulpConfig.src.views, view, 'index.njk');
    var extname = path.extname(srcPath);
    var basename = path.basename(srcPath, extname);
    var distPath = path.join(gulpConfig.dist.base, basename + '.html');
    var html = nunjucks.render(resolve(srcPath), context);

    return fs.outputFileAsync(resolve(distPath), html, 'utf-8');
  });
};
