import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import history from './history';
import { verifyToken } from './actions/authAction';
import store from './store';
import App from './App';

import './assets/styles/vendor.scss';
import './assets/styles/main.scss';

store.dispatch(verifyToken());

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
