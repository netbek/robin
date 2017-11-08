var moment = require('moment');
var randomInt = require('./randomInt');

module.exports = function randomActivity(year) {
  var firstDay = moment([year]);
  var daysInYear = firstDay.isLeapYear() ? 366 : 365;

  return Array(daysInYear)
    .fill()
    .map(function(v, i) {
      return {
        date: firstDay.dayOfYear(i + 1).format('YYYY-MM-DD'),
        activity: randomInt(0, 25)
      };
    });
};
