import PropTypes from 'prop-types';
import React from 'react';
import {extent as d3Extent} from 'd3-array';
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from 'd3-scale';
import {schemeCategory10 as d3SchemeCategory10} from 'd3-scale-chromatic';
import RobinAxis from 'Robin/js/components/RobinAxis';
import RobinChart from 'Robin/js/components/RobinChart';
import theme from '../../../../js/theme';

const width = 500;
const height = 500;
const margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60
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

  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps));
  }

  computeState(props) {
    const {entities} = props;
    const data = entities.iris;

    const species = _.uniq(data.map(d => d.species));

    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    const plotData = data.map((d, i) => ({
      index: i,
      x: d.sepalWidth,
      y: d.sepalLength,
      color: colorScale(d.species)
    }));

    const xScale = d3ScaleLinear()
      .domain(d3Extent(plotData, d => d.x))
      .range([0, width - margin.right - margin.left])
      .nice();

    const yScale = d3ScaleLinear()
      .domain(d3Extent(plotData, d => d.y))
      .range([height - margin.top - margin.bottom, 0])
      .nice();

    return {
      data,
      plotData,
      xScale,
      yScale
    };
  }

  render() {
    console.log('render');

    const {entities} = this.props;
    const data = entities.iris;
    const {plotData, xScale, yScale} = this.state;

    return (
      <div className="robin-example">
        <div style={{overflow: 'hidden', overflowX: 'auto'}}>
          <div style={{minWidth: width}}>
            <RobinChart
              width={width}
              height={height}
              padding={margin}
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
              <g className="scatter">
                {plotData.map((d, i) => (
                  <circle
                    key={d.index}
                    cx={xScale(d.x)}
                    cy={yScale(d.y)}
                    r={3.5}
                    style={{
                      fill: d.color,
                      opacity: 1
                    }}
                  />
                ))}
              </g>
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
