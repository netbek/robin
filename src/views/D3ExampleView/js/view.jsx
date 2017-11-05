import {assign} from 'lodash';
import jQuery from 'jquery';
import React from 'react';
import D3Example from 'D3Example/js/components/D3Example';

const $view = jQuery('.view');

// Load data from container element attributes.
var data = {
  entities: {}, // Model entities
  env: {} // Environment vars
};
assign(data, $view.data());

export default class View extends React.Component {
  render() {
    return <D3Example {...data} />;
  }
}
