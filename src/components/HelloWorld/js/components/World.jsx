import PropTypes from 'prop-types';
import React from 'react';
import randomInt from 'utils/randomInt';

class World extends React.Component {
  static propTypes = {
    worlds: PropTypes.array
  };

  static defaultProps = {
    worlds: [
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune'
    ]
  };

  render() {
    const {worlds} = this.props;
    const world = worlds[randomInt(0, worlds.length)];

    return <span className="world">{world}</span>;
  }
}

export default World;
