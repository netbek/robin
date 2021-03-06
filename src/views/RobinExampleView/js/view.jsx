import {assign} from 'lodash';
import jQuery from 'jquery';
import React from 'react';
import Component from 'RobinExample/js/components/RobinExample';

const $view = jQuery('.view');

// Load data from container element attributes.
var data = {
  entities: {}, // Model entities
  env: {} // Environment vars
};
assign(data, $view.data());

export default class View extends React.Component {
  render() {
    return <Component {...data} />;
  }
}
