import PropTypes from 'prop-types';
import React from 'react';
import Hello from './Hello';
import World from './World';
import randomInt from 'utils/randomInt';
import {LANG_AF, LANG_EN, LANG_XH} from '../constants';

class HelloWorld extends React.Component {
  static propTypes = {
    langs: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    langs: [LANG_AF, LANG_EN, LANG_XH]
  };

  render() {
    const {langs} = this.props;
    const lang = langs[randomInt(0, langs.length)];

    return (
      <div className="hello-world">
        <Hello lang={lang} />, <World />!
      </div>
    );
  }
}

export default HelloWorld;
