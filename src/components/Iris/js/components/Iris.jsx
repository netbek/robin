import _ from 'lodash';
import dl from 'datalib';
import PropTypes from 'prop-types';
import React from 'react';
// import PlotSemiotic from './PlotSemiotic';
// import PlotVictory from './PlotVictory';
import PlotVx from './PlotVx';

function parse(data) {
  const fieldNames = data.length ? _.keys(data[0]).slice(1) : [];

  const formattedFieldNames = fieldNames.map(d => _.camelCase(d));

  return data.map(d =>
    _.zipObject(
      formattedFieldNames,
      fieldNames.map(
        fieldName =>
          fieldName === 'Species' ? d[fieldName] : Number(d[fieldName])
      )
    )
  );
}

class Iris extends React.Component {
  static propTypes = {
    margin: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    accessors: PropTypes.array,
    url: PropTypes.string
  };

  static defaultProps = {
    margin: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    },
    width: 400,
    height: 400,
    accessors: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
    url: '/data/rdatasets/csv/datasets/iris.csv'
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
    const {url} = this.props;

    dl.csv(url, function(err, data) {
      if (err) {
        console.error(err);
        return;
      }

      const plotData = parse(data);

      setState({plotData});
    });
  }

  handleAccessorChange(axis, e) {
    this.setState({[axis + 'Accessor']: e.target.value});
  }

  render() {
    const {width, height, margin, accessors} = this.props;
    const {plotData, xAccessor, yAccessor} = this.state;
    const handleXAccessorChange = this.handleAccessorChange.bind(this, 'x');
    const handleYAccessorChange = this.handleAccessorChange.bind(this, 'y');

    return (
      <div>
        <p>
          Based on{' '}
          <a href="https://bl.ocks.org/mbostock/3887118" target="_blank">
            bl.ocks.org/mbostock/3887118
          </a>
        </p>

        <form className="form-inline">
          <div className="form-group">
            <label
              htmlFor="xAccessor"
              className="col-form-label col-form-label-sm"
            >
              x:
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
              y:
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
          <PlotVx
            data={plotData}
            width={width}
            height={height}
            margin={margin}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
        </div>
      </div>
    );

    // <PlotSemiotic
    //   data={plotData}
    //   width={width}
    //   height={height}
    //   margin={margin}
    //   xAccessor={xAccessor}
    //   yAccessor={yAccessor}
    // />
    // <PlotVictory
    //   data={plotData}
    //   width={width}
    //   height={height}
    //   margin={margin}
    //   xAccessor={xAccessor}
    //   yAccessor={yAccessor}
    // />
  }
}

export default Iris;
