import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import View from './view';

const $view = jQuery('.view');

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    $view.get(0)
  );
};

render(View);

if (module.hot) {
  module.hot.accept('./view', () => {
    render(View);
  });
}
