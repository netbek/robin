import PropTypes from 'prop-types';
import React from 'react';
import {LANG_AF, LANG_EN, LANG_XH} from '../constants';

class Hello extends React.Component {
  static propTypes = {
    lang: PropTypes.oneOf([LANG_AF, LANG_EN, LANG_XH])
  };

  static defaultProps = {
    lang: LANG_EN
  };

  render() {
    const {lang} = this.props;

    let greeting = null;

    switch (lang) {
      case LANG_AF:
        greeting = 'Hallo';
        break;

      case LANG_XH:
        greeting = 'Molo';
        break;

      case LANG_EN:
      default:
        greeting = 'Hello';
        break;
    }

    return <span className="hello">{greeting}</span>;
  }
}

export default Hello;
