import React, {Component} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './scenes/Home';
import LoginPage from './scenes/Auth/Login';
import FeedsPage from './scenes/Feeds';
// import SignupPage from './scenes/Auth/Signup';
// import UserPage from './scenes/User';
// import SettingsPage from './scenes/Settings';
// import FeedInfo from './scenes/FeedInfo';
import store from 'store';

import 'assets/styles/main.scss';

render (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/feeds" component={FeedsPage}/>
        <Route exact path="/login" component={LoginPage}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
);
