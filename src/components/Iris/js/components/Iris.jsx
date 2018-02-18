import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import loadAndParse from 'utils/papaLoadAndParse';
import {extent as d3Extent} from 'd3-array';
import {format as d3Format} from 'd3-format';
import {
  scaleLinear as d3ScaleLinear,
  scaleOrdinal as d3ScaleOrdinal
} from 'd3-scale';
import {schemeCategory10 as d3SchemeCategory10} from 'd3-scale-chromatic';
import {XYFrame, Legend} from 'semiotic';
import {Mark} from 'semiotic-mark';

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

    const plotWidth = 500 - margin.left - margin.right;
    const plotHeight = 500 - margin.top - margin.bottom;

    const xExtent = d3Extent(plotData, d => d.sepalWidth);
    const yExtent = d3Extent(plotData, d => d.sepalLength);

    const species = _.uniq(plotData.map(d => d.species));

    const xScale = d3ScaleLinear()
      .range([0, plotWidth])
      .domain(xExtent)
      .nice();

    const yScale = d3ScaleLinear()
      .range([plotHeight, 0])
      .domain(yExtent)
      .nice();

    // const colorScale = d3ScaleOrdinal()
    //   .domain(_.uniq(plotData.map(d => d.species)))
    //   .range(d3SchemeCategory10);

    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    // console.log(colorScale('setosa'));
    // console.log(colorScale('versicolor'));

    const legendGroups = [
      {
        styleFn: d => ({fill: d.color}),
        items: species.map(d => ({label: d, color: colorScale(d)}))
      }
    ];

    return (
      <div>
        <p>
          <a href="https://bl.ocks.org/mbostock/3887118" target="_blank">
            bl.ocks.org/mbostock/3887118
          </a>{' '}
          recreated with Semiotic.
        </p>

        <XYFrame
          size={[plotWidth, plotHeight]}
          margin={margin}
          customPointMark={d => <Mark markType="circle" r={3.5} />}
          points={plotData}
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
              ticks: 6,
              tickFormat: d => d3Format('.1f')(d)
            },
            {
              orient: 'bottom',
              label: 'Sepal width (cm)',
              ticks: 6,
              tickFormat: d => d3Format('.1f')(d)
            }
          ]}
          legend={{
            title: 'Species',
            legendGroups: legendGroups,
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

export default Iris;
