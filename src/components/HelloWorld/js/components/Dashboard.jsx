import PropTypes from 'prop-types';
import React from 'react';
// import loadAndParse from '../utils/jqLoadAndParse';
import loadAndParse from '../utils/papaLoadAndParse';
import {first} from 'lodash';
import moment from 'moment';
import {ascending as d3Ascending, mean as d3Mean} from 'd3-array';
import {nest as d3Nest} from 'd3-collection';

class Dashboard extends React.Component {
  loadIris() {
    const url = '/node_modules/rdatasets/csv/datasets/iris.csv';

    // See http://papaparse.com/docs#config for description of CSV parser config.
    const config = {
      header: true,
      skipEmptyLines: true
    };

    function clean(data) {
      const fieldNames = data.length ? _.keys(data[0]).slice(1) : [];

      const formattedFieldNames = fieldNames.map(function(key) {
        return _.camelCase(key);
      });

      return data.map(function(datum) {
        return _.zipObject(
          formattedFieldNames,
          fieldNames.map(function(fieldName) {
            return fieldName === 'Species'
              ? datum[fieldName]
              : Number(datum[fieldName]);
          })
        );
      });
    }

    loadAndParse(url, config).then(function(data) {
      console.log(`Loaded data length: ${clean(data).length}`);
    });
  }

  loadOzone() {
    const url = '/datasets/laqn/hk6-20160101-20161231.csv';

    const config = {
      header: false,
      skipEmptyLines: true
    };

    loadAndParse(url, config).then(function(data) {
      const header = data[0];
      const rows = data.slice(1);

      // Find the field with the date value.
      const dateFieldIndex = 0;

      // Find the field with the ozone value.
      const ozoneFieldName = first(
        header.filter(function(value) {
          const matches = value.match(/^(.+):(.+)(\(.+\))$/i);
          return matches && matches[2].trim().toLowerCase() === 'ozone';
        })
      );
      const ozoneFieldIndex = ozoneFieldName
        ? header.indexOf(ozoneFieldName)
        : -1;

      const ozoneMean = d3Nest()
        .key(d => moment(d.date, moment.ISO_8601).format('YYYY-MM-DD'))
        .sortKeys(d3Ascending)
        .rollup(v => d3Mean(v, d => d.ozone))
        .entries(
          rows.map(d => ({
            date: d[dateFieldIndex],
            ozone: Number(d[ozoneFieldIndex])
          }))
        );

      console.log(
        `Mean of "${ozoneFieldName}" on ${ozoneMean[0].key}: ${ozoneMean[0]
          .value}`
      );
    });
  }

  componentDidMount() {
    this.loadOzone();
  }

  render() {
    return <div>@todo Add table</div>;
  }
}

export default Dashboard;
