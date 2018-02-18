import PropTypes from 'prop-types';
import React from 'react';
import themeMaterial from 'Robin/js/themes/material';

class RobinChart extends React.Component {
  static propTypes = {
    children: PropTypes.node,
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

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseMove(e) {}

  render() {
    const {handleMouseMove} = this;
    const {children, height, padding, theme, width, onMouseMove} = this.props;

    const computedTheme = Object.assign({}, theme.chart, {
      padding: padding || theme.chart.padding,
      width: width || theme.chart.width,
      height: height || theme.chart.height
    });

    return (
      <svg
        className="robin-chart"
        width={computedTheme.width}
        height={computedTheme.height}
        ref={node => (this.svg = node)}
        onMouseMove={onMouseMove}
      >
        <g
          style={{
            transform: `translate(${computedTheme.padding.left}px,${
              computedTheme.padding.top
            }px)`
          }}
        >
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              theme: theme,
              chartWidth: computedTheme.width,
              chartHeight: computedTheme.height,
              chartPadding: computedTheme.padding
            })
          )}
        </g>
      </svg>
    );
  }
}

export default RobinChart;
