import _ from 'lodash';
import React from 'react';
import loadAndParse from 'utils/papaLoadAndParse';

class Iris extends React.Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const url = '/data/rdatasets/csv/datasets/iris.csv';

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

  render() {
    return <div>@todo Add table</div>;
  }
}

export default Iris;
