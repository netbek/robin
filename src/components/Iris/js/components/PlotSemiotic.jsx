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
import {XYFrame} from 'semiotic';
import {Mark} from 'semiotic-mark';

class PlotSemiotic extends React.Component {
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

    // const xExtent = d3Extent(data, d => d.sepalWidth);
    // const yExtent = d3Extent(data, d => d.sepalLength);
    //
    // const xScale = d3ScaleLinear()
    //   .range([0, plotWidth])
    //   .domain(xExtent)
    //   .nice();
    //
    // const yScale = d3ScaleLinear()
    //   .range([plotHeight, 0])
    //   .domain(yExtent)
    //   .nice();

    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    const legendData = [
      {
        styleFn: d => ({fill: d.color}),
        items: species.map(d => ({label: d, color: colorScale(d)}))
      }
    ];

    return (
      <div className="plot plot--semiotic">
        <XYFrame
          size={[plotWidth, plotHeight]}
          margin={margin}
          customPointMark={d => <Mark markType="circle" r={3.5} />}
          points={data}
          pointStyle={d => ({
            fill: colorScale(d.species),
            stroke: 'none',
            strokeWidth: 1
          })}
          xAccessor="sepalWidth"
          yAccessor="sepalLength"
          axes={[
            {
              orient: 'left',
              label: 'Sepal length (cm)',
              tickFormat: d => d3Format('.1f')(d)
            },
            {
              orient: 'bottom',
              label: 'Sepal width (cm)',
              tickFormat: d => d3Format('.1f')(d)
            }
          ]}
          legend={{
            title: 'Species',
            legendGroups: legendData,
            position: 'right'
          }}
          hoverAnnotation
          tooltipContent={d => (
            <div className="tooltip-content">
              <dl>
                <dt>Species</dt>
                <dd>{d.species}</dd>

                <dt>Sepal length (cm)</dt>
                <dd>{d.sepalLength}</dd>

                <dt>Sepal width (cm)</dt>
                <dd>{d.sepalWidth}</dd>
              </dl>
            </div>
          )}
        />
      </div>
    );
  }
}

export default PlotSemiotic;
