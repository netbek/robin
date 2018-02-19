import PropTypes from 'prop-types';
import React from 'react';

class Plot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    margin: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    xAccessor: PropTypes.string.isRequired,
    yAccessor: PropTypes.string.isRequired
  };

  static defaultProps = {
    data: [],
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    width: 300,
    height: 300
  };
}

export default Plot;
