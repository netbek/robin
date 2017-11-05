import PropTypes from 'prop-types';
import React from 'react';
import {keys, uniq, zipObject} from 'lodash';
import {extent as d3ArrayExtent} from 'd3-array';
import {axisBottom as d3AxisBottom, axisLeft as d3AxisLeft} from 'd3-axis';
import {easeExpOut as d3EaseExpOut} from 'd3-ease';
import {scaleLinear as d3ScaleLinear} from 'd3-scale';
import {select as d3Select} from 'd3-selection';
import 'd3-selection-multi';
import {line as d3Line} from 'd3-shape';
import {voronoi as d3Voronoi} from 'd3-voronoi';
import {scaleOrdinal, schemeCategory10} from 'd3-scale';
import {Annotation, ConnectorLine, Note} from 'react-annotation';
import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';
import regression from 'regression';
import NodeGroup from 'react-move/NodeGroup';
import theme from 'theme';

const voronoiRadius = 50;

const legendSymbolWidth = 16;
const legendSymbolHeight = 16;
const legendSymbolPadding = 6;

function getHyphenatedStyles(style) {
  const k = keys(style);
  const hyphenatedK = k.map(k => hyphenateStyleName(k));
  const v = k.map(k => style[k]);

  return zipObject(hyphenatedK, v);
}

class D3Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.computeChartState(props));

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  computeChartState(props) {
    const {entities} = props;

    const color = scaleOrdinal(schemeCategory10);

    const plotData = entities.iris.map(function(d, i) {
      return {
        index: i,
        x: d.sepalWidth,
        y: d.sepalLength,
        color: color(d.species)
      };
    });

    const legendData = uniq(entities.iris.map(d => d.species)).map(function(
      d,
      i
    ) {
      return {
        index: i,
        name: d,
        color: color(d)
      };
    });

    const padding = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 960 - padding.left - padding.right;
    const height = 500 - padding.top - padding.bottom;

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.x))
      .range([0, width])
      .nice();

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.y))
      .range([height, 0])
      .nice();

    const voronoi = d3Voronoi()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      })
      .extent([[0, 0], [width, height]])(plotData);

    const hoverIndex = null;
    const voronoiX = 0;
    const voronoiY = 0;

    // // const trendData = plotData.map(d => [d.x, d.y]).slice(0, 2);
    // const trendData = [[2.5, 4.5], [3, 6]];
    //
    // // const result = regression('linear', trendData);
    // const result = regression('linear', [
    //   trendData.map(d => d[0]),
    //   trendData.map(d => d[1])
    // ]);
    // const gradient = result.equation[0];
    // const intercept = result.equation[1];
    //
    // const x1 = trendData[0][0];
    // const y1 = gradient + intercept;
    // const x2 = trendData[trendData.length - 1][0];
    // const y2 = gradient * trendData.length + intercept;
    // const trendline = [x1, y1, x2, y2];

    return {
      voronoiX,
      voronoiY,
      hoverIndex,
      plotData,
      legendData,
      voronoi
      // trendline
    };
  }
  handleMouseMove(e) {
    const padding = {top: 20, right: 20, bottom: 30, left: 40};

    // const x = e.nativeEvent.offsetX - padding.left;
    // const y = e.nativeEvent.offsetY - padding.top;

    const {top, left} = jQuery(this.svg).offset();
    const x = e.pageX - left - padding.left;
    const y = e.pageY - top - padding.top;

    const {hoverIndex, voronoi} = this.state;
    const site = voronoi.find(x, y, voronoiRadius);

    const voronoiX = x;
    const voronoiY = y;

    this.setState({voronoiX, voronoiY});

    const nextHoverIndex = site && site.data ? site.index : null;

    if (hoverIndex != nextHoverIndex) {
      this.setState({hoverIndex: nextHoverIndex});
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.computeChartState(nextProps));
  }
  render() {
    console.log('render');

    const {handleMouseMove} = this;
    const {entities} = this.props;
    const {
      voronoiX,
      voronoiY,
      hoverIndex,
      legendData,
      plotData,
      voronoi
      // trendline
    } = this.state;

    // console.log('render', hoverIndex);
    // console.log(voronoi.polygons()[0]);

    // const width = 960;
    // const height = 500;

    const width = 960;
    const height = 500;
    const padding = {top: 20, right: 20, bottom: 30, left: 40};
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.x))
      .range([0, plotWidth])
      .nice();

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(plotData, d => d.y))
      .range([plotHeight, 0])
      .nice();

    const xAxis = d3AxisBottom()
      .scale(xScale)
      .ticks(12);

    const yAxis = d3AxisLeft()
      .scale(yScale)
      .ticks(9);

    const axisStyle = getHyphenatedStyles(theme.axis.style.axis);
    const ticksStyle = getHyphenatedStyles(theme.axis.style.ticks);
    const tickLabelsStyle = getHyphenatedStyles(theme.axis.style.tickLabels);

    const chartAxisX = (
      <g
        className="xAxis"
        ref={function(node) {
          const axis = d3Select(node).call(xAxis);
          axis.selectAll('.domain').styles(axisStyle);
          axis.selectAll('.tick line').styles(ticksStyle);
          axis.selectAll('.tick text').styles(tickLabelsStyle);
        }}
        style={{
          transform: `translate(0,${plotHeight}px)`
        }}
      >
        <text
          className="label"
          x={plotWidth}
          y={-10}
          style={Object.assign({}, theme.axis.style.axisLabel, {
            textAnchor: 'end'
          })}
        >
          Sepal width (cm)
        </text>
      </g>
    );

    const scatter = (
      <g className="scatter">
        {plotData.map((d, i) => (
          <circle
            key={d.index}
            cx={xScale(d.x)}
            cy={yScale(d.y)}
            r={3.5}
            style={{
              fill: i == hoverIndex ? 'black' : d.color,
              opacity: i == hoverIndex ? 1 : 0.5
            }}
          />
        ))}
      </g>
    );

    // const scatter = (
    //   <NodeGroup
    //     data={plotData}
    //     keyAccessor={d => d.index}
    //     start={(data, index) => ({
    //       x: xScale(data.x),
    //       y: yScale(0)
    //       // opacity: 0
    //     })}
    //     enter={(data, index) => ({
    //       y: yScale(data.y),
    //       // opacity: [0.5],
    //       timing: {duration: 5000, delay: 0, ease: d3EaseExpOut}
    //     })}
    //     leave={(data, index) => ({
    //       y: yScale(0)
    //       // opacity: 0
    //     })}
    //   >
    //     {nodes => {
    //       return (
    //         <g>
    //           {nodes.map(({key, data, state}) => {
    //             console.log(state.x);
    //
    //             return (
    //               <circle
    //                 key={key}
    //                 cx={state.x}
    //                 cy={state.y}
    //                 r={3.5}
    //                 style={{
    //                   fill: data.index == hoverIndex ? 'black' : data.color,
    //                   opacity: data.index == hoverIndex ? 1 : state.opacity
    //                 }}
    //               />
    //             );
    //           })}
    //         </g>
    //       );
    //     }}
    //   </NodeGroup>
    // );

    // const trendline = <line
    //   x1={xScale(trendline[0])}
    //   y1={yScale(trendline[1])}
    //   x2={xScale(trendline[2])}
    //   y2={yScale(trendline[3])}
    //   style={{stroke: 'red'}}
    // />;

    const chartAxisY = (
      <g
        className="yAxis"
        ref={function(node) {
          const axis = d3Select(node).call(yAxis);
          axis.selectAll('.domain').styles(axisStyle);
          axis.selectAll('.tick line').styles(ticksStyle);
          axis.selectAll('.tick text').styles(tickLabelsStyle);
        }}
        style={{
          transform: 'rotate(-90)'
        }}
      >
        <text
          className="label"
          transform="rotate(-90)"
          y={10}
          dy=".71em"
          style={Object.assign({}, theme.axis.style.axisLabel, {
            textAnchor: 'end'
          })}
        >
          Sepal length (cm)
        </text>
      </g>
    );

    const legend = (
      <g className="legend">
        {legendData.map((d, i) => (
          <g
            key={d.index}
            style={{
              transform: `translate(${0}px,${i *
                (legendSymbolHeight + legendSymbolPadding)}px)`
            }}
          >
            <rect
              x={plotWidth - legendSymbolWidth}
              width={legendSymbolWidth}
              height={legendSymbolHeight}
              style={{fill: d.color}}
            />
            <text
              x={plotWidth - legendSymbolWidth - legendSymbolPadding}
              y={legendSymbolHeight / 2}
              dy=".35em"
              style={Object.assign({}, theme.legend.style.labels, {
                textAnchor: 'end'
              })}
            >
              {d.name}
            </text>
          </g>
        ))}
      </g>
    );

    const annotations = (
      <g>
        <Annotation
          x={xScale(plotData[0].x)}
          y={yScale(plotData[0].y)}
          dx={148}
          dy={-117}
          title={'Annotations :)'}
          label={'Longer text to show text wrapping'}
        >
          <ConnectorLine />
          <Note lineType="horizontal" wrap={150} padding={20} />
        </Annotation>
      </g>
    );

    const voronoiDebugPolygons = (
      <g>
        {voronoi
          .polygons()
          .map(d => (
            <path
              key={d.data.index}
              style={{stroke: 'red', fill: 'none', opacity: 0.25}}
              d={`M${d.join('L')}Z`}
            />
          ))}
      </g>
    );

    const voronoiDebugRadius = (
      <g>
        <circle
          r={voronoiRadius}
          cx={voronoiX}
          cy={voronoiY}
          style={{stroke: 'red', fill: 'none'}}
        />
      </g>
    );

    return (
      <div className="d3-example">
        <div style={{overflow: 'hidden', overflowX: 'auto'}}>
          <div style={{minWidth: width}}>
            <svg
              className="chart"
              width={width}
              height={height}
              ref={node => (this.svg = node)}
              onMouseMove={handleMouseMove}
            >
              <g
                style={{
                  transform: `translate(${padding.left}px,${padding.top}px)`
                }}
              >
                {chartAxisX}
                {chartAxisY}
                {scatter}
                {legend}
                {annotations}
                {voronoiDebugPolygons}
                {voronoiDebugRadius}
              </g>
            </svg>
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
            {entities.iris.map(function(d, i) {
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

D3Example.propTypes = {
  entities: PropTypes.object,
  env: PropTypes.object
};

D3Example.defaultProps = {
  entities: undefined,
  env: undefined
};

export default D3Example;
