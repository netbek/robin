import PropTypes from 'prop-types';
import React from 'react';

class RobinTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      left: 0
    };
  }

  componentDidMount() {
    this.setState(this.getBounds());
  }

  // componentDidUpdate() {
  //   console.log(this.state.x);
  // }

  getBounds() {
    const {datum} = this.props;
    const $node = jQuery(this.node);
    const width = $node.width();
    const height = $node.height();

    return {
      top: datum.y,
      left: datum.x + width / 2
    };
  }

  render() {
    const {children} = this.props;
    const {top, left} = this.state;

    return (
      <div
        className="robin-tooltip robin-tooltip--top"
        style={{top, left}}
        ref={node => (this.node = node)}
      >
        <div className="robin-tooltip__content">{children}</div>
      </div>
    );
  }
}

export default RobinTooltip;
