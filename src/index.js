import React, {Component} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import { verifyToken } from './actions/authAction';

import 'assets/styles/vendor.scss';
import 'assets/styles/main.scss';

import store from 'store';
import App from './App';
store.dispatch(verifyToken());

render (
  <Provider store={store}>
    <Router history={history}>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('app')
);

