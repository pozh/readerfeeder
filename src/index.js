import React, {Component} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

// import SignupPage from './scenes/Auth/Signup';
// import SettingsPage from './scenes/Settings';

import 'assets/styles/main.scss';

import store from 'store';
import App from './App';

render (
  <Provider store={store}>
    <Router history={history}>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('app')
);

