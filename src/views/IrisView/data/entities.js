// function resolve(filePath) {
//   return path.join(__dirname, '../../../../', filePath);
// }
//
// var path = require('path');
// var _ = require('lodash');
// var fs = require('fs-extra');
// var Papa = require('papaparse');
//
// var src = resolve('node_modules/rdatasets/csv/datasets/iris.csv');
// var file = fs.readFileSync(src, {encoding: 'binary'});
// var parsed = Papa.parse(file, {header: true, skipEmptyLines: true});
//
// var data = parsed.data;
// var fieldNames = data.length ? _.keys(data[0]).slice(1) : [];
// var formattedFieldNames = fieldNames.map(function(key) {
//   return _.camelCase(key);
// });
// var result = data.map(function(row) {
//   return _.zipObject(
//     formattedFieldNames,
//     fieldNames.map(function(key) {
//       return key === 'Species' ? row[key] : Number(row[key]);
//     })
//   );
// });
//
// module.exports = {
//   iris: result
// };

module.exports = {};
