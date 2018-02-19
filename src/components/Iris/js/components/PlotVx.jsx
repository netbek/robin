import _ from 'lodash';
import React from 'react';
import {extent} from 'd3-array';
import {scaleOrdinal as d3ScaleOrdinal} from 'd3-scale';
import {schemeCategory10 as d3SchemeCategory10} from 'd3-scale-chromatic';
import {Group} from '@vx/group';
import {AxisBottom, AxisLeft} from '@vx/axis';
import {RectClipPath} from '@vx/clip-path';
import {scaleLinear} from '@vx/scale';
import {getCoordsFromEvent} from '@vx/brush';
import {voronoi, VoronoiPolygon} from '@vx/voronoi';
import theme from '../theme';
import Plot from './Plot';

const neighborRadius = 75;

class PlotVx extends Plot {
  static computeState(props) {
    const {data, width, height, margin, xAccessor, yAccessor} = props;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const colorScale = d3ScaleOrdinal(d3SchemeCategory10);

    const plotData = data.map((d, i) => ({
      id: `d-${i}`,
      x: d[xAccessor],
      y: d[yAccessor],
      fill: colorScale(d.species)
    }));

    const xScale = scaleLinear({
      domain: extent(plotData, d => d.x),
      range: [0, innerWidth]
    }).nice();

    const yScale = scaleLinear({
      domain: extent(plotData, d => d.y),
      range: [innerHeight, 0]
    }).nice();

    const voronoiDiagram = voronoi({
      x: d => xScale(d.x),
      y: d => yScale(d.y),
      width: innerWidth,
      height: innerHeight
    })(plotData);

    return {
      selected: null,
      selectedNeighbors: null,
      xScale: xScale,
      yScale: yScale,
      voronoiDiagram: voronoiDiagram,
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      plotData: plotData
    };
  }

  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = PlotVx.computeState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.xAccessor !== this.props.xAccessor ||
      nextProps.yAccessor !== this.props.yAccessor ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      this.setState(PlotVx.computeState(nextProps));
    }
  }

  handleMouseMove(event) {
    const {margin} = this.props;
    const {voronoiDiagram} = this.state;
    const {x, y} = getCoordsFromEvent(this.svg, event);

    const closest = voronoiDiagram.find(
      x - margin.left,
      y - margin.top,
      neighborRadius
    );

    // const {x, y} = localPoint(this._svg, event);
    //
    // showTooltip({
    //   tooltipLeft: x,
    //   tooltipTop: y
    // });

    if (closest) {
      this.setState({selected: closest});
    }
  }

  render() {
    const {width, height, margin, xAccessor, yAccessor} = this.props;

    const {
      plotData,
      // voronoiDiagram,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      selected
    } = this.state;

    // const polygons = voronoiDiagram.polygons();
    // const voronoiDebugPolygons = polygons.map(polygon => (
    //   <VoronoiPolygon
    //     key={`polygon-${polygon.data.id}`}
    //     polygon={polygon}
    //     fill="#000"
    //     fillOpacity={0}
    //     stroke="#f00"
    //     strokeWidth={1}
    //   />
    // ));

    return (
      <div className="plot plot--vx">
        <svg
          width={width}
          height={height}
          ref={ref => {
            this.svg = ref;
          }}
        >
          <AxisBottom
            label={xAccessor}
            labelProps={Object.assign({}, theme.axis.style.axisLabel)}
            top={height - margin.bottom}
            left={margin.left}
            scale={xScale}
            tickLength={5}
            tickLabelProps={(d, i) =>
              Object.assign({}, theme.axis.style.tickLabels, {
                dy: '0.25em',
                textAnchor: 'middle'
              })
            }
          />
          <AxisLeft
            label={yAccessor}
            labelProps={Object.assign({}, theme.axis.style.axisLabel)}
            top={margin.top}
            left={margin.left}
            scale={yScale}
            tickLength={5}
            tickLabelProps={(d, i) =>
              Object.assign({}, theme.axis.style.tickLabels, {
                dx: '-0.25em',
                dy: '0.25em',
                textAnchor: 'end'
              })
            }
          />
          <Group
            top={margin.top}
            left={margin.left}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={() => {
              this.setState({selected: null});
            }}
          >
            <rect
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              stroke="none"
            />
            {plotData.map(d => (
              <circle
                key={`circle-${d.id}`}
                r={selected && d.id === selected.data.id ? 5 : 3.5}
                cx={xScale(d.x)}
                cy={yScale(d.y)}
                fill={selected && d.id === selected.data.id ? '#000' : d.fill}
              />
            ))}
          </Group>
        </svg>
      </div>
    );
  }
}

export default ({
  width,
  height,
  margin,
  data,
  events,
  xAccessor,
  yAccessor
}) => (
  <PlotVx
    width={width}
    height={height}
    margin={margin}
    data={data}
    events={events}
    xAccessor={xAccessor}
    yAccessor={yAccessor}
  />
);
