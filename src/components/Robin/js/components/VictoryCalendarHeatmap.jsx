import PropTypes from 'prop-types';
import React from 'react';
import themeMaterial from 'Robin/js/themes/material';
import {VictoryScatter} from 'victory';

class VictoryCalendarHeatmap extends React.Component {
  render() {
    const {props} = this;

    return <VictoryScatter {...props} />;
  }
}

export default VictoryCalendarHeatmap;
