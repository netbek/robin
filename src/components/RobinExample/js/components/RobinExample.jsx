import PropTypes from 'prop-types';
import React from 'react';
import RobinAxis from 'Robin/js/components/RobinAxis';
import RobinChart from 'Robin/js/components/RobinChart';
import theme from '../../../../js/theme';
import {extent as d3ArrayExtent} from 'd3-array';
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal,
  schemeCategory10 as d3SchemeCategory10
} from 'd3-scale';

const width = 960;
const height = 500;
const padding = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

class RobinExample extends React.Component {
  static propTypes = {
    entities: PropTypes.object,
    env: PropTypes.object
  };

  static defaultProps = {
    entities: undefined,
    env: undefined
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.computeState(props));
  }

  computeState(props) {
    const {entities} = props;
    const data = entities.iris;

    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    const plotData = data.map(function(d, i) {
      return {
        index: i,
        x: d.sepalWidth,
        y: d.sepalLength,
        color: colorScale(d.species)
      };
    });

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.x))
      .range([0, width - padding.right - padding.left])
      .nice();

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.y))
      .range([height - padding.top - padding.bottom, 0])
      .nice();

    return {
      plotData,
      xScale,
      yScale
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps));
  }

  render() {
    console.log('render');

    const {entities} = this.props;
    const {xScale, yScale} = this.state;
    const data = entities.iris;

    return (
      <div className="robin-example">
        <div style={{overflow: 'hidden', overflowX: 'auto'}}>
          <div style={{minWidth: width}}>
            <RobinChart
              width={width}
              height={height}
              padding={padding}
              theme={theme}
            >
              <RobinAxis
                orientation="left"
                scale={yScale}
                label="Sepal length (cm)"
              />
              <RobinAxis
                orientation="bottom"
                scale={xScale}
                label="Sepal width (cm)"
              />
            </RobinChart>
          </div>
        </div>

        <table className="table">
          <caption>iris</caption>
          <thead>
            <tr>
              <th scope="col">Species</th>
              <th scope="col">Sepal length</th>
              <th scope="col">Sepal width</th>
              <th scope="col">Petal length</th>
              <th scope="col">Petal width</th>
            </tr>
          </thead>
          <tbody>
            {data.map(function(d, i) {
              return (
                <tr key={i}>
                  <td>{d.species}</td>
                  <td>{d.sepalLength}</td>
                  <td>{d.sepalWidth}</td>
                  <td>{d.petalLength}</td>
                  <td>{d.petalWidth}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RobinExample;
