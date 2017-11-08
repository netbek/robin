import PropTypes from 'prop-types';
import React from 'react';
// import RobinAxis from 'Robin/js/components/RobinAxis';
import RobinChart from 'Robin/js/components/RobinChart';
import theme from '../../../../js/theme';
import {extent as d3Extent} from 'd3-array';
import {
  scaleLinear as d3ScaleLinear,
  scaleQuantize as d3ScaleQuantize
} from 'd3-scale';
import {schemeYlGn as d3SchemeYlGn} from 'd3-scale-chromatic';
import {first, last} from 'lodash';
import moment from 'moment';
import {
  ascending as d3Ascending,
  descending as d3Descending,
  min as d3Min,
  mean as d3Mean,
  sum as d3Sum
} from 'd3-array';
import {nest as d3Nest, values as d3Values} from 'd3-collection';
import {
  timeFormat as d3TimeFormat,
  timeParse as d3TimeParse
} from 'd3-time-format';

// @todo Set height based on block size.
const width = 960;
const height = 300;
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
    // const data = entities.activity.slice(0, 3);
    const data = entities.activity;

    const plotData = d3Nest()
      .key(d => moment(d.date, moment.ISO_8601).format('YYYY-MM-DD'))
      // .key(d => parseDate(d.date))
      .sortKeys(d3Ascending)
      .rollup(v => d3Sum(v, d => d.activity))
      // .map(data)
      .entries(data);

    return {
      plotData
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps));
  }

  render() {
    console.log('render');

    const {entities} = this.props;
    const {plotData} = this.state;
    const data = entities.activity;

    const plotWidth = width - padding.right - padding.left;
    const plotHeight = height - padding.top - padding.bottom;

    const sizeByYear = plotHeight;
    const sizeByDay = d3Min([sizeByYear / 8, plotWidth / 54]);
    const day = function(d) {
      return (d.getDay() + 6) % 7;
    };
    const week = d3TimeFormat('%W');
    const parseDate = d3TimeParse('%Y-%m-%d');

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const domain = d3Extent(plotData, d => d.value);
    const count = 5;

    const legendScale = d3ScaleLinear()
      .domain([0, count - 1])
      .range(domain);

    const legendData = Array(count)
      .fill()
      .map(function(v, i) {
        return legendScale(i);
      });

    const colorScale = d3ScaleQuantize()
      .domain(domain)
      .range(d3SchemeYlGn[count]);
    const nilColor = '#EEE';

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
              <g className="heatmap">
                {plotData.map(function(d) {
                  const date = parseDate(d.key);

                  return (
                    <rect
                      key={d.key}
                      className="day"
                      style={{
                        fill: d.value ? colorScale(d.value) : nilColor,
                        strokeWidth: '2px',
                        stroke: 'white',
                        shapeRendering: 'crispEdges'
                      }}
                      width={sizeByDay}
                      height={sizeByDay}
                      x={week(date) * sizeByDay}
                      y={day(date) * sizeByDay}
                    />
                  );
                })}
              </g>

              <g className="axis">
                {dayNames.map(function(d, i) {
                  if (i % 2) {
                    return null;
                  }

                  return (
                    <g
                      key={d}
                      className="axis-label"
                      style={{
                        transform: `translate(-${sizeByDay / 2}px,${sizeByDay *
                          (i + 1)}px)`
                      }}
                    >
                      <text
                        className={dayNames[i]}
                        dy="-.35em"
                        style={Object.assign({}, theme.axis.style.tickLabels, {
                          textAnchor: 'end'
                        })}
                      >
                        {dayNames[i]}
                      </text>
                    </g>
                  );
                })}
              </g>

              <g className="axis">
                {monthNames.map(function(d, i) {
                  // @todo Set x position based on number of days. Months
                  // shouldn't be evenly spaced.
                  return (
                    <g
                      key={d}
                      className="axis-label"
                      style={{
                        transform: `translate(${(i + 0.5) *
                          (plotWidth / 12)}px,-${sizeByDay / 2}px)`
                      }}
                    >
                      <text
                        className={monthNames[i]}
                        dy="-.35em"
                        style={Object.assign({}, theme.axis.style.tickLabels, {
                          textAnchor: 'middle'
                        })}
                      >
                        {monthNames[i]}
                      </text>
                    </g>
                  );
                })}
              </g>

              <g
                className="legend"
                style={{transform: `translate(0px,${sizeByDay * 8}px)`}}
              >
                {legendData.map(function(d, i) {
                  return (
                    <rect
                      key={d}
                      className="legend-datum"
                      style={{
                        fill: d ? colorScale(d) : nilColor,
                        strokeWidth: '2px',
                        stroke: 'white',
                        shapeRendering: 'crispEdges'
                      }}
                      width={sizeByDay}
                      height={sizeByDay}
                      x={i * sizeByDay}
                      y={0}
                    />
                  );
                })}

                <g
                  className="legend-label"
                  style={{
                    transform: `translate(-${sizeByDay / 2}px,${sizeByDay}px)`
                  }}
                >
                  <text
                    dy="-.35em"
                    style={Object.assign({}, theme.legend.style.labels, {
                      textAnchor: 'end'
                    })}
                  >
                    {domain[0]}
                  </text>
                </g>

                <g
                  className="legend-label"
                  style={{
                    transform: `translate(${legendData.length * sizeByDay +
                      sizeByDay / 2}px,${sizeByDay}px)`
                  }}
                >
                  <text
                    dy="-.35em"
                    style={Object.assign({}, theme.legend.style.labels, {
                      textAnchor: 'start'
                    })}
                  >
                    {domain[1]}
                  </text>
                </g>
              </g>
            </RobinChart>
          </div>
        </div>

        <table className="table">
          <caption>activity</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Activity</th>
            </tr>
          </thead>
          <tbody>
            {data.map(function(d, i) {
              return (
                <tr key={i}>
                  <td>{d.date}</td>
                  <td>{d.activity}</td>
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
