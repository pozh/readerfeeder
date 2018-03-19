import React, {Component} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import HomePage from './scenes/Home';
import LoginPage from './scenes/Auth/Login';
import FeedsPage from './scenes/Feeds';
import UserPage from './scenes/User';

// import SignupPage from './scenes/Auth/Signup';
// import SettingsPage from './scenes/Settings';

import 'assets/styles/main.scss';

import store from 'store';

render (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/feeds" component={FeedsPage}/>
        <Route path="/feed" component={FeedsPage}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route component={UserPage}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app')
);

