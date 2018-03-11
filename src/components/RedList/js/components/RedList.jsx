import React from 'react';
import {scaleOrdinal} from '@vx/scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import Chart from './Chart';

const width = 450;
const height = 450;
const rotate = [140, 0, 0];
const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [145.746726, 15.185048]},
      properties: {name: 'Golden white-eye'}
    },
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-78.846099, -33.6414]},
      properties: {name: 'Juan Fernández firecrown'}
    },
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-159.526124, 22.09644]},
      properties: {name: 'Kauaʻi nukupuʻu'}
    },
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-156.331925, 20.798363]},
      properties: {name: 'Maui nukupuʻu'}
    },
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [-149.829523, -17.538843]},
      properties: {name: 'Moorea reed warbler'}
    }
  ]
};
const colorScale = scaleOrdinal({
  domain: data.features.map(d => d.properties.name),
  range: schemeCategory10
});

class RedList extends React.Component {
  render() {
    return (
      <div>
        <Chart {...{data, width, height, rotate, colorScale}} />

        <table className="table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Name</th>
              <th scope="col">Latitude (°)</th>
              <th scope="col">Longitude (°)</th>
            </tr>
          </thead>
          <tbody>
            {data.features.map(d => (
              <tr key={d.properties.name}>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      width: 12,
                      height: 12,
                      background: colorScale(d.properties.name)
                    }}
                  />
                </td>
                <th scope="row">{d.properties.name}</th>
                <td>{d.geometry.coordinates[1]}</td>
                <td>{d.geometry.coordinates[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RedList;
