const moment = require('moment');
const randomInt = require('./randomInt');

module.exports = function(year, min, max) {
  const firstDay = moment([year]);
  const daysInYear = firstDay.isLeapYear() ? 366 : 365;

  return Array(daysInYear)
    .fill()
    .map(function(v, i) {
      return {
        date: firstDay.dayOfYear(i + 1).format('YYYY-MM-DD'),
        activity: randomInt(min, max)
      };
    });
};
