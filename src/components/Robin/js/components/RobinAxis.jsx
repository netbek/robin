import PropTypes from 'prop-types';
import React from 'react';
import themeMaterial from 'Robin/js/themes/material';
import {
  axisTop as d3AxisTop,
  axisRight as d3AxisRight,
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft
} from 'd3-axis';
import {select as d3Select} from 'd3-selection';
import 'd3-selection-multi';
import {ORIENTATION} from 'Robin/js/constants';
import hyphenateStyle from 'Robin/js/utils/hyphenateStyle';

const {TOP, RIGHT, BOTTOM, LEFT} = ORIENTATION;

class RobinAxis extends React.Component {
  static propTypes = {
    axisComponent: PropTypes.element,
    axisLabelComponent: PropTypes.element,
    height: PropTypes.number,
    label: PropTypes.any,
    orientation: PropTypes.oneOf([BOTTOM, LEFT]),
    scale: PropTypes.function,
    style: PropTypes.shape({
      axis: PropTypes.object,
      axisLabel: PropTypes.object,
      grid: PropTypes.object,
      ticks: PropTypes.object,
      tickLabels: PropTypes.object
    }),
    theme: PropTypes.object,
    tickComponent: PropTypes.element,
    tickCount: PropTypes.number,
    tickFormat: PropTypes.func,
    tickLabelComponent: PropTypes.element,
    tickValues: PropTypes.array,
    width: PropTypes.number
  };

  static defaultProps = {
    orientation: BOTTOM,
    theme: themeMaterial
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.computeState(props));
  }

  computeState(props) {
    const {
      chartPadding,
      chartWidth,
      chartHeight,
      width,
      height,
      padding,
      orientation,
      scale,
      style,
      theme,
      tickCount
    } = props;

    const computedTheme = Object.assign({}, theme.axis, {
      padding: padding || 0,
      width: width || chartWidth - chartPadding.right - chartPadding.left,
      height: height || chartHeight - chartPadding.top - chartPadding.bottom
    });

    var axis;

    switch (orientation) {
      case TOP:
        axis = d3AxisTop();
        break;

      case RIGHT:
        axis = d3AxisRight();
        break;

      case BOTTOM:
        axis = d3AxisBottom();
        break;

      case LEFT:
        axis = d3AxisLeft();
        break;
    }

    axis.scale(scale).ticks(tickCount);

    return {
      axis,
      theme: computedTheme
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.computeState(nextProps));
  }

  render() {
    const {label, orientation} = this.props;
    const {axis, theme} = this.state;
    const {width, height, style} = theme;

    var nodeStyle = {};
    var axisLabelProps = {};
    var axisLabelStyle = {};

    switch (orientation) {
      case TOP:
        break;

      case RIGHT:
        break;

      case BOTTOM:
        nodeStyle = {
          transform: `translate(0,${height}px)`
        };
        axisLabelProps = {
          x: width,
          y: -10
        };
        axisLabelStyle = Object.assign({}, style.axisLabel, {
          textAnchor: 'end'
        });
        break;

      case LEFT:
        nodeStyle = {
          transform: 'rotate(-90)'
        };
        axisLabelProps = {
          transform: 'rotate(-90)',
          y: 10,
          dy: '.71em'
        };
        axisLabelStyle = Object.assign({}, style.axisLabel, {
          textAnchor: 'end'
        });
        break;
    }

    return (
      <g
        className="robin-axis"
        ref={function(node) {
          const axisNode = d3Select(node).call(axis);
          const axisStyle = hyphenateStyle(style.axis);
          const ticksStyle = hyphenateStyle(style.ticks);
          const tickLabelsStyle = hyphenateStyle(style.tickLabels);

          axisNode.selectAll('.domain').styles(axisStyle);
          axisNode.selectAll('.tick line').styles(ticksStyle);
          axisNode.selectAll('.tick text').styles(tickLabelsStyle);
        }}
        style={nodeStyle}
      >
        <text {...axisLabelProps} style={axisLabelStyle}>
          {label}
        </text>
      </g>
    );
  }
}

export default RobinAxis;
