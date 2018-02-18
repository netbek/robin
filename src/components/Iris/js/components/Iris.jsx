import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import loadAndParse from 'utils/papaLoadAndParse';
import PlotSemiotic from './PlotSemiotic';
import PlotVictory from './PlotVictory';

class Iris extends React.Component {
  static propTypes = {
    margin: PropTypes.object,
    accessors: PropTypes.array
  };

  static defaultProps = {
    margin: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    },
    accessors: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth']
  };

  constructor(props) {
    super();

    this.state = {
      plotData: [],
      xAccessor: props.accessors[0],
      yAccessor: props.accessors[1]
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

  handleAccessorChange(axis, e) {
    this.setState({[axis + 'Accessor']: e.target.value});
  }

  render() {
    const {margin, accessors} = this.props;
    const {plotData, xAccessor, yAccessor} = this.state;
    const handleXAccessorChange = this.handleAccessorChange.bind(this, 'x');
    const handleYAccessorChange = this.handleAccessorChange.bind(this, 'y');

    return (
      <div>
        <p>
          <a href="https://bl.ocks.org/mbostock/3887118" target="_blank">
            bl.ocks.org/mbostock/3887118
          </a>{' '}
          recreated with Semiotic and Victory.
        </p>

        <form className="form-inline">
          <div className="form-group">
            <label
              htmlFor="xAccessor"
              className="col-form-label col-form-label-sm"
            >
              xAccessor:
            </label>
            <select
              id="xAccessor"
              className="form-control form-control-sm"
              onChange={handleXAccessorChange}
            >
              {accessors.map(d => (
                <option
                  value={d}
                  selected={d === xAccessor}
                  disabled={d === yAccessor}
                >
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label
              htmlFor="yAccessor"
              className="col-form-label col-form-label-sm"
            >
              yAccessor:
            </label>
            <select
              id="yAccessor"
              className="form-control form-control-sm"
              onChange={handleYAccessorChange}
            >
              {accessors.map(d => (
                <option
                  value={d}
                  selected={d === yAccessor}
                  disabled={d === xAccessor}
                >
                  {d}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="plots">
          <PlotSemiotic
            data={plotData}
            margin={margin}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
          <PlotVictory
            data={plotData}
            margin={margin}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
        </div>
      </div>
    );
  }
}

export default Iris;
