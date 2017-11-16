import Papa from 'papaparse';
import Promise from 'bluebird';

/**
 * Load file and parse its contents with Papa Parse.
 *
 * @param   {string} url
 * @param   {Object} parseConfig
 * @returns {Promise}
 */
export default function papaLoadAndParse(url, parseConfig) {
  return new Promise(function(resolve, reject) {
    Papa.parse(
      url,
      Object.assign({}, parseConfig, {
        download: true,
        complete: function(result) {
          if (result.errors.length) {
            console.error(result.errors);
          }

          resolve(result.data);
        },
        error: function(err) {
          reject(err);
        }
      })
    );
  });
}
