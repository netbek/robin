import PropTypes from 'prop-types';
import React from 'react';

class HelloWorld extends React.Component {
  static propTypes = {
    entities: PropTypes.object,
    env: PropTypes.object
  };

  static defaultProps = {
    entities: undefined,
    env: undefined
  };

  render() {
    return <div className="hello-world">@todo</div>;
  }
}

export default HelloWorld;
