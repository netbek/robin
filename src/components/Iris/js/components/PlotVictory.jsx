import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {extent as d3Extent} from 'd3-array';
import {format as d3Format} from 'd3-format';
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from 'd3-scale';
import {schemeCategory10 as d3SchemeCategory10} from 'd3-scale-chromatic';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import theme from '../theme';

class PlotVictory extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    margin: PropTypes.object
  };

  static defaultProps = {
    data: [],
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  };

  render() {
    const {margin, data} = this.props;

    if (!data) {
      return null;
    }

    const width = 500;
    const height = 500;

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const species = _.uniq(data.map(d => d.species));

    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    const legendData = species.map(d => ({
      name: d,
      symbol: {fill: colorScale(d), type: 'square'}
    }));

    const legendWidth = 100;

    return (
      <div className="plot plot--victory">
        <VictoryChart
          containerComponent={<VictoryVoronoiContainer responsive={false} />}
          width={plotWidth}
          height={plotHeight}
          padding={margin}
          theme={theme}
        >
          <VictoryAxis
            label="Sepal width (cm)"
            style={{
              grid: {
                fill: 'none',
                stroke: 'none'
              }
            }}
          />
          <VictoryAxis
            label="Sepal length (cm)"
            style={{
              grid: {
                fill: 'none',
                stroke: 'none'
              }
            }}
            dependentAxis
          />
          <VictoryLegend
            x={plotWidth - legendWidth}
            y={margin.top}
            width={legendWidth}
            title="Species"
            centerTitle
            orientation="vertical"
            gutter={10}
            symbolSpacer={10}
            data={legendData}
          />
          <VictoryScatter
            style={{
              data: {
                fill: d => colorScale(d.species)
              }
            }}
            size={3.5}
            data={data}
            x="sepalWidth"
            y="sepalLength"
            labels={d =>
              `Species: ${d.species}\nSepal length: ${
                d.sepalLength
              }\nSepal width: ${d.sepalWidth}`
            }
            labelComponent={<VictoryTooltip {...theme.tooltip} />}
          />
        </VictoryChart>
      </div>
    );
  }
}

export default PlotVictory;
