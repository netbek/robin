function resolve(filePath) {
  return path.join(__dirname, '../../../../', filePath);
}

var path = require('path');
var randomActivity = require(resolve('gulp/utils/randomActivity'));

module.exports = {
  activity: randomActivity(2015, 0, 250)
};
