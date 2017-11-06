import jQuery from 'jquery';
import Papa from 'papaparse';
import Promise from 'bluebird';

/**
 * Load file with jQuery, parse its contents with Papa Parse.
 *
 * @param   {string} url
 * @param   {Object} parseConfig
 * @returns {Promise}
 */
export default function jqLoadAndParse(url, parseConfig) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      cache: false,
      // method: 'GET', // Optional because default is 'GET'
      url: url,
      // headers: {
      //   Accept: 'text/csv; charset=utf-8',
      //   'Content-Type': 'text/csv; charset=utf-8'
      // }, // Optional request headers
      success: function(data, textStatus, jqXHR) {
        const result = Papa.parse(data, parseConfig);

        if (result.errors.length) {
          console.error(result.errors);
        }

        resolve(result.data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}
