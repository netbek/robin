import PropTypes from 'prop-types';
import React from 'react';
import loadAndParse from 'utils/papaLoadAndParse';
import {first} from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import {ascending as d3Ascending, mean as d3Mean} from 'd3-array';
import {nest as d3Nest} from 'd3-collection';
import {
  STATE_EMPTY,
  STATE_ERROR,
  STATE_PROGRESS,
  STATE_SUCCESS
} from '../constants';

class AirQuality extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      uiState: STATE_PROGRESS
    };
  }

  loadData() {
    const setState = this.setState.bind(this);

    setState({uiState: STATE_PROGRESS});

    const url = '/datasets/laqn/hk6-20160101-20161231.csv';

    const config = {
      header: false,
      skipEmptyLines: true
    };

    loadAndParse(url, config).then(data => {
      if (!data.length) {
        throw new Error('No data');
      }

      const header = data[0];
      const rows = data.slice(1);

      // Find the field with the date value.
      const dateFieldIndex = 0;

      // Find the field with the ozone value.
      const ozoneFieldName = first(
        header.filter(value => {
          const matches = value.match(/^(.+):(.+)(\(.+\))$/i);
          return matches && matches[2].trim().toLowerCase() === 'ozone';
        })
      );
      const ozoneFieldIndex = ozoneFieldName
        ? header.indexOf(ozoneFieldName)
        : -1;

      const dailyMean = d3Nest()
        .key(d => moment(d.date, moment.ISO_8601).format('YYYY-MM-DD'))
        .sortKeys(d3Ascending)
        .rollup(v => d3Mean(v, d => d.ozone))
        .entries(
          rows.map(d => ({
            date: d[dateFieldIndex],
            ozone: Number(d[ozoneFieldIndex])
          }))
        );

      const annualMean = d3Mean(dailyMean, d => d.value);

      setState({
        uiState: STATE_SUCCESS,
        title: ozoneFieldName,
        annualMean: numeral(annualMean).format('0.0'),
        dailyMean: dailyMean.map(d =>
          Object.assign(d, {value: numeral(d.value).format('0.0')})
        )
      });
    });
  }

  componentDidMount() {
    this.loadData();
  }

  renderEmpty() {}

  renderProgress() {
    return <div>Loading data ...</div>;
  }

  renderSuccess() {
    const {title, annualMean, dailyMean} = this.state;

    return (
      <div>
        <table className="table">
          <caption>Summary: {title}</caption>
          <tbody>
            <tr>
              <th scope="row">Annual mean</th>
              <td>{annualMean}</td>
            </tr>
          </tbody>
        </table>

        <div>@todo Add visual</div>

        <table className="table">
          <caption>Data: {title}</caption>
          <tbody>
            {dailyMean.map(d => {
              return (
                <tr key={d.key}>
                  <th scope="row">{d.key}</th>
                  <td>{d.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const {uiState} = this.state;

    let body = null;

    switch (uiState) {
      case STATE_EMPTY:
        body = this.renderEmpty();
        break;

      case STATE_PROGRESS:
        body = this.renderProgress();
        break;

      case STATE_SUCCESS:
        body = this.renderSuccess();
        break;
    }

    return <div>{body}</div>;
  }
}

export default AirQuality;
