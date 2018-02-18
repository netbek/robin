const _ = require('lodash');
const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const shell = require('shelljs');
const URI = require('urijs');

const CACHE_DIR = path.join(__dirname, '.cache');
const DATA_DIR = path.join(__dirname, 'data');

function urlToFilename(url) {
  const parts = _.trim(
    URI(url)
      .scheme('')
      .toString(),
    '/'
  )
    .toLowerCase()
    .split('/')
    .map(function(value) {
      return sanitizeFilename(value, {replacement: '-'});
    });

  return path.join.apply(null, parts);
}

function get(url) {
  const file = path.join(CACHE_DIR, urlToFilename(url));
  const dirname = path.dirname(file);

  return fs.pathExists(file).then(function(exists) {
    if (!exists) {
      return fs
        .ensureDir(dirname)
        .then(function() {
          return download(url, dirname);
        })
        .then(function() {
          return Promise.resolve(file);
        });
    }

    return Promise.resolve(file);
  });
}

function decompressTargz(src, dest, options = {stripComponents: 0}) {
  return fs.emptyDir(dest).then(function() {
    const command = `tar -zxf ${src} --directory=${dest} --strip-components=${
      options.stripComponents
    }`;
    const result = shell.exec(command);

    return Promise.resolve(result);
  });
}

get('https://github.com/vincentarelbundock/Rdatasets/archive/master.tar.gz')
  .then(function(file) {
    return decompressTargz(file, path.join(DATA_DIR, 'rdatasets'), {
      stripComponents: 1
    });
  })
  .catch(function(err) {
    console.error(err);
  });
