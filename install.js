const _ = require('lodash');
const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const sanitizeFilename = require('sanitize-filename');
const shell = require('shelljs');
const URI = require('urijs');

Promise.promisifyAll(fs);

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
  const filename = path.basename(file);

  return fs.pathExists(file).then(function(exists) {
    if (!exists) {
      return fs
        .ensureDir(dirname)
        .then(function() {
          return download(url, dirname, {filename: filename});
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

function decompressZip(src, dest, options = {stripComponents: 0}) {
  return fs.emptyDir(dest).then(function() {
    const command = `unzip ${src} -d ${dest}`;
    const result = shell.exec(command);

    return Promise.resolve(result);
  });
}

function buildGeoNames(src, dest) {
  const zip = function(arr, indexes, names) {
    return _.zipObject(names, indexes.map(i => arr[i]));
  };

  return fs.readFileAsync(src, 'utf8').then(function(data) {
    const rows = _.trim(data)
      .split('\n')
      .map(d =>
        zip(
          d.split('\t'),
          [1, 8, 4, 5, 14, 17],
          [
            'name',
            'countryCode',
            'latitude',
            'longitude',
            'population',
            'timezone'
          ]
        )
      )
      .map(d => ({
        coordinates: [Number(d.longitude), Number(d.latitude)],
        name: d.name,
        countryCode: d.countryCode.toLowerCase(),
        population: Number(d.population),
        timezone: d.timezone
      }));

    const countryCodes = _.uniq(rows.map(d => d.countryCode));

    return Promise.mapSeries(countryCodes, function(countryCode) {
      return Promise.mapSeries(['js', 'json'], function(format) {
        switch (format) {
          case 'js':
            return fs.outputFile(
              path.join(dest, format, countryCode + '.' + format),
              `module.exports = ${JSON.stringify(
                rows.filter(d => d.countryCode === countryCode),
                null,
                2
              )};`,
              'utf8'
            );

          case 'json':
            return fs.outputFile(
              path.join(dest, format, countryCode + '.' + format),
              JSON.stringify(
                rows.filter(d => d.countryCode === countryCode),
                null,
                2
              ),
              'utf8'
            );
        }
      });
    });
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

get('http://download.geonames.org/export/dump/cities15000.zip')
  .then(function(file) {
    return decompressZip(file, path.join(DATA_DIR, 'geonames'));
  })
  .then(function() {
    return buildGeoNames(
      path.join(DATA_DIR, 'geonames/cities15000.txt'),
      path.join(DATA_DIR, 'geonames/cities15000')
    );
  })
  .catch(function(err) {
    console.error(err);
  });
