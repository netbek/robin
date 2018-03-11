import PropTypes from 'prop-types';
import React from 'react';
import {geoOrthographic, geoPath} from 'd3-geo';
import {Orthographic} from '@vx/geo';
import {PatternLines} from '@vx/pattern';
import {merge as topojsonMerge} from 'topojson-client';
import topology from '@vx/demo/static/vx-geo/world-topo.json';

const features = [topojsonMerge(topology, topology.objects.units.geometries)];

class Chart extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    rotate: PropTypes.arrayOf(PropTypes.number),
    colorScale: PropTypes.func
  };

  static defaultProps = {
    width: 450,
    height: 450,
    rotate: [0, 0, 0]
  };

  static computeState(props) {
    const {features} = props.data;
    const {width, height, rotate} = props;

    const scale = (width - 2) / 2;
    const translate = [width / 2, height / 2];

    const projection = geoOrthographic()
      .scale(scale)
      .translate(translate)
      .rotate(rotate);

    const path = geoPath().projection(projection);

    const data = features;

    return {
      data,
      projection,
      scale,
      translate,
      path
    };
  }

  constructor(props) {
    super(props);

    this.state = Chart.computeState(props);
  }

  render() {
    const {width, height, rotate, colorScale} = this.props;
    const {data, scale, translate, projection, path} = this.state;
    const color = '#999';

    return (
      <div className="chart" style={{width, height}}>
        <svg width={width} height={height}>
          <PatternLines
            id="dLines"
            height={4}
            width={4}
            stroke={color}
            strokeWidth={1}
            orientation={['diagonal']}
          />

          <Orthographic
            data={features}
            scale={scale}
            translate={translate}
            rotate={rotate}
            fill="none"
            stroke="none"
            graticule={{
              stroke: color,
              strokeWidth: 1,
              strokeDasharray: '1,5'
            }}
          />

          {features.map((d, i) => (
            <path
              key={`fill-${i}`}
              d={path(d)}
              fill="#fff"
              stroke={color}
              strokeWidth={1}
            />
          ))}

          {features.map((d, i) => (
            <path
              key={`pattern-${i}`}
              d={path(d)}
              fill="url(#dLines)"
              stroke="none"
            />
          ))}

          <circle
            r={(width - 2) / 2}
            cx={width / 2}
            cy={height / 2}
            fill="none"
            stroke={color}
            strokeWidth={1}
          />

          {data.map(function(d) {
            const coords = projection(d.geometry.coordinates).map(d =>
              Math.round(d)
            );

            return (
              <circle
                key={d.properties.name}
                r={4}
                cx={coords[0]}
                cy={coords[1]}
                fill={colorScale(d.properties.name)}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}

export default Chart;
