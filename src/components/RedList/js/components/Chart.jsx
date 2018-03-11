/**
 * Stroke inside hack: https://stackoverflow.com/a/32162431
 */

import PropTypes from 'prop-types';
import React from 'react';
import {geoGraticule, geoOrthographic, geoPath} from 'd3-geo';
import {Orthographic} from '@vx/geo';
import {PatternLines} from '@vx/pattern';
import {merge as topojsonMerge} from 'topojson-client';
import topology from '@vx/demo/static/vx-geo/world-topo.json';

const features = [topojsonMerge(topology, topology.objects.units.geometries)];

class Chart extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    center: PropTypes.arrayOf(PropTypes.number),
    rotate: PropTypes.arrayOf(PropTypes.number),
    colorScale: PropTypes.func
  };

  static defaultProps = {
    width: 450,
    height: 450,
    center: [0, 0],
    rotate: [0, 0, 0]
  };

  static computeState(props) {
    const {features} = props.data;
    const {width, height, center, rotate} = props;

    const scale = (width - 2) / 2;
    const translate = [width / 2, height / 2];

    const projection = geoOrthographic()
      .scale(scale)
      .translate(translate)
      .center(center)
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
    const {width, height, center, rotate, colorScale} = this.props;
    const {data, scale, translate, projection, path} = this.state;
    const fill = '#fff';
    const stroke = '#666';

    return (
      <div className="chart" style={{width, height}}>
        <svg width={width} height={height}>
          <PatternLines
            id="dLines"
            height={4}
            width={4}
            stroke={stroke}
            strokeWidth={1}
            orientation={['diagonal']}
          />

          <circle
            r={(width - 2) / 2}
            cx={width / 2}
            cy={height / 2}
            fill="none"
            stroke={stroke}
            strokeWidth={1}
          />

          <Orthographic
            data={features}
            scale={scale}
            translate={translate}
            rotate={rotate}
            center={center}
            graticule={{
              step: [15, 15],
              stroke: stroke,
              strokeWidth: 1,
              strokeDasharray: '1,3'
            }}
            fill="none"
            stroke="none"
          />

          {features.map((d, i) => (
            <defs>
              <path id={`path-${i}`} d={path(d)} />
              <clipPath id={`clip-${i}`}>
                <use xlinkHref={`#path-${i}`} />
              </clipPath>
            </defs>
          ))}

          {features.map((d, i) => (
            <g>
              <use xlinkHref={`#path-${i}`} fill={fill} />
              <use
                xlinkHref={`#path-${i}`}
                fill="url(#dLines)"
                stroke={stroke}
                strokeWidth={1.5}
              />
              <use
                xlinkHref={`#path-${i}`}
                stroke={fill}
                strokeWidth={4.5}
                fill="url(#dLines)"
                clipPath={`url(#clip-${i})`}
              />
            </g>
          ))}

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
                fillOpacity={0.5}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}

export default Chart;
