import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import loadAndParse from 'utils/papaLoadAndParse';
import PlotSemiotic from './PlotSemiotic';
import PlotVictory from './PlotVictory';

class Iris extends React.Component {
  static propTypes = {
    margin: PropTypes.object
  };

  static defaultProps = {
    margin: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    }
  };

  constructor() {
    super();

    this.state = {
      plotData: []
    };

    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const {setState} = this;

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
      const plotData = clean(data);

      setState({plotData});
    });
  }

  render() {
    const {margin} = this.props;
    const {plotData} = this.state;

    return (
      <div>
        <p>
          <a href="https://bl.ocks.org/mbostock/3887118" target="_blank">
            bl.ocks.org/mbostock/3887118
          </a>{' '}
          recreated with Semiotic and Victory.
        </p>

        <div className="plots">
          <PlotSemiotic margin={margin} data={plotData} />
          <PlotVictory margin={margin} data={plotData} />
        </div>
      </div>
    );
  }
}

export default Iris;
