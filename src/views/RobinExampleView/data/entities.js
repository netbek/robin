function resolve(filePath) {
  return path.join(__dirname, '../../../../', filePath);
}

var path = require('path');
var _ = require('lodash');
var fs = require('fs-extra');
var Papa = require('papaparse');
var randomActivity = require(resolve('gulp/utils/randomActivity'));

// var src = resolve('node_modules/rdatasets/csv/datasets/iris.csv');
// var file = fs.readFileSync(src, {encoding: 'binary'});
// var parsed = Papa.parse(file, {header: true, skipEmptyLines: true});
//
// var rows = parsed.data;
// var cols = rows.length ? _.keys(rows[0]).slice(1) : [];
// var cleanCols = cols.map(function(key) {
//   return _.camelCase(key);
// });
// var cleanRows = rows.map(function(row) {
//   return _.zipObject(
//     cleanCols,
//     cols.map(function(key) {
//       return key === 'Species' ? row[key] : Number(row[key]);
//     })
//   );
// });

module.exports = {
  activity: randomActivity(2015)
  // iris: cleanRows
};
