import PropTypes from 'prop-types';
import React from 'react';
// import RobinAxis from 'Robin/js/components/RobinAxis';
// import RobinChart from 'Robin/js/components/RobinChart';
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryScatter
} from 'victory';
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

class VictoryCalendarHeatmapExample extends React.Component {
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

    const data = d3Nest()
      .key(d => moment(d.date, moment.ISO_8601).format('YYYY-MM-DD'))
      .sortKeys(d3Ascending)
      .rollup(v => d3Sum(v, d => d.activity))
      // .entries(entities.activity.slice(0, 3));
      .entries(entities.activity);

    const day = function(d) {
      return (d.getDay() + 6) % 7;
    };
    const week = d3TimeFormat('%W');
    const parseDate = d3TimeParse('%Y-%m-%d');

    const domain = d3Extent(data, d => d.value);
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

    const plotData = data.map((d, i) => {
      const date = parseDate(d.key);

      return Object.assign(d, {
        x: Number(week(date)),
        y: 7 - day(date),
        fill: d.value ? colorScale(d.value) : nilColor
      });
    });

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
    // const sizeByDay = d3Min([sizeByYear / 8, plotWidth / 54]);
    const sizeByDay = 16;
    const day = function(d) {
      return (d.getDay() + 6) % 7;
    };
    const week = d3TimeFormat('%W');
    const parseDate = d3TimeParse('%Y-%m-%d');

    // @todo Use d3-time-format https://github.com/d3/d3-time-format#locales
    const dayNames = [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ].reverse();

    // @todo Use d3-time-format https://github.com/d3/d3-time-format#locales
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

    var getWeekDate = function(year, weekNumber, dayNumber) {
      var date = new Date(year, 0, 0, 0, 0, 0);
      var day = new Date(year, 0, 0, 0, 0, 0);
      var month = day.getTime() - date.getDay() * 86400000;
      var ans = new Date(month + ((weekNumber - 1) * 7 + dayNumber) * 86400000);

      if (weekNumber === 1 && ans.getMonth() !== 0) {
        // We're still in last year... handle appropriately
        console.log('here');
      }

      return ans;
    };

    const xExtent = d3Extent(plotData, d => d.x);

    const xTickValues = Array(xExtent[1] + 1)
      .fill()
      .map(function(v, i) {
        return i;
      });

    const year = 2015;

    var done = [];

    function xTickFormat(d, i) {
      const month = getWeekDate(year, d + 1, 0).getMonth();

      if (!i || ~done.indexOf(month) || (!done.length && month)) {
        return '';
      }

      done.push(month);

      return monthNames[month];
    }

    return (
      <div className="robin-example">
        <div style={{overflow: 'hidden', overflowX: 'auto'}}>
          <div style={{minWidth: width}}>
            <VictoryChart
              width={
                sizeByDay * (xExtent[1] + 1) + padding.right + padding.left
              }
              height={sizeByDay * 7 + padding.top + padding.bottom}
              padding={padding}
              theme={theme}
              containerComponent={<VictoryContainer responsive={false} />}
            >
              <VictoryAxis
                dependentAxis
                tickFormat={d => ((d - 1) % 2 ? '' : dayNames[d - 1])}
                style={{
                  axis: {stroke: 'none'},
                  grid: {stroke: 'none'},
                  ticks: {stroke: 'none'}
                }}
              />
              <VictoryAxis
                tickValues={xTickValues}
                tickFormat={xTickFormat}
                tickLabelComponent={<VictoryLabel dx={-sizeByDay / 2} />}
                style={{
                  axis: {stroke: 'none'},
                  grid: {stroke: 'none'},
                  ticks: {stroke: 'none'},
                  tickLabels: {textAnchor: 'start'}
                }}
              />
              <VictoryScatter
                size={sizeByDay / 2}
                symbol="square"
                style={{
                  data: {
                    shapeRendering: 'crispEdges'
                  }
                }}
                data={plotData}
              />
            </VictoryChart>
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

export default VictoryCalendarHeatmapExample;
