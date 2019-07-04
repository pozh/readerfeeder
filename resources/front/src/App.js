import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { VENDOR_ID } from 'constants/common';

import LoginPage from './scenes/Auth/Login';
import SignupPage from './scenes/Auth/Signup';
import FeedsPage from './scenes/Feeds/FeedsPage';
import RequireAuth from './utils/RequireAuth';
import Subscriptions from './scenes/User/components/Subscriptions';
import Settings from './scenes/User/components/Settings';

if (typeof Paddle === 'object') Paddle.Setup({ vendor: VENDOR_ID });

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={RequireAuth(Subscriptions)} />
      <Route path="/settings" component={RequireAuth(Settings)} />
      <Route path="/feeds" component={RequireAuth(FeedsPage)} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
    </Switch>
    <NotificationContainer />
  </div>
);

export default App;
