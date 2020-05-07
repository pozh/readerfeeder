import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationContainer } from 'react-notifications';

import LoginPage from './scenes/Auth/Login';
import SignupPage from './scenes/Auth/Signup';
import HomePage from './scenes/MainPages/HomePage';
import FeedsPage from './scenes/Feeds/FeedsPage';
import RequireAuth from './utils/RequireAuth';
import Subscriptions from './scenes/User/Home';
import Settings from './scenes/User/Settings';

import 'assets/styles/app.scss';

if (typeof Paddle === 'object') Paddle.Setup({ vendor: parseInt(VENDOR_ID, 10) });

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <div>
        <Switch>
          <Route exact path="/" component={isAuthenticated ? RequireAuth(Subscriptions) : HomePage} />
          <Route path="/browse" component={FeedsPage} />
          <Route exact path="/feeds" component={RequireAuth(Subscriptions)} />
          <Route path="/settings" component={RequireAuth(Settings)} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
        </Switch>
        <NotificationContainer />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, null)(App);
