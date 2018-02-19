import _ from 'lodash';
import {extent as d3Extent} from 'd3-array';
import {format as d3Format} from 'd3-format';
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from 'd3-scale';
import {schemeCategory10 as d3SchemeCategory10} from 'd3-scale-chromatic';
import {XYFrame} from 'semiotic';
import {Mark} from 'semiotic-mark';
import Plot from './Plot';

class PlotSemiotic extends Plot {
  render() {
    const {data, margin, width, height, xAccessor, yAccessor} = this.props;

    if (!data) {
      return null;
    }

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

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
          renderKey={(d, i) => `${d.id || i}-${xAccessor}-${yAccessor}`}
          title="Iris"
          size={[innerWidth, innerHeight]}
          margin={margin}
          customPointMark={d => <Mark markType="circle" r={3.5} />}
          points={data}
          pointStyle={d => ({
            fill: colorScale(d.species),
            stroke: 'none',
            strokeWidth: 1
          })}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          axes={[
            {
              orient: 'left',
              label: `${xAccessor}`,
              tickFormat: d => d3Format('.1f')(d)
            },
            {
              orient: 'bottom',
              label: `${yAccessor}`,
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
                <dt>species</dt>
                <dd>{d.species}</dd>

                <dt>{xAccessor}</dt>
                <dd>{d[xAccessor]}</dd>

                <dt>{yAccessor}</dt>
                <dd>{d[yAccessor]}</dd>
              </dl>
            </div>
          )}
        />
      </div>
    );
  }
}

export default PlotSemiotic;
