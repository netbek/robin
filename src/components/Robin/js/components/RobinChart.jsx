import PropTypes from 'prop-types';
import React from 'react';
import themeMaterial from 'Robin/js/themes/material';
import computeTheme from 'Robin/js/utils/computeTheme';

class RobinChart extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    padding: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    theme: PropTypes.object,
    width: PropTypes.number
  };

  static defaultProps = {
    height: 300,
    padding: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    },
    theme: themeMaterial,
    width: 450
  };

  constructor(props) {
    super(props);

    // this.state = Object.assign({}, this.computeState(props));

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseMove(e) {}

  render() {
    const {handleMouseMove} = this;
    const {children, height, padding, theme, width} = this.props;

    const computedTheme = computeTheme({
      theme: theme.chart,
      padding,
      width,
      height
    });

    console.log(computedTheme);

    return (
      <svg
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
          {React.Children.map(children, child =>
            React.cloneElement(child, {theme: computedTheme})
          )}
        </g>
      </svg>
    );
  }
}

export default RobinChart;
