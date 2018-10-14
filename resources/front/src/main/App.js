import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

import HomePage from './scenes/Home';
import LoginPage from './scenes/Auth/Login';
import SignupPage from './scenes/Auth/Signup';
import FeedsPage from './scenes/Feeds/FeedsPage';
import UserPage from './scenes/User';
import TermsPage from "./scenes/Static/TermsPage";
import PrivacyPage from "./scenes/Static/PrivacyPage";

import { VENDOR_ID } from './constants/common';

if (typeof Paddle === 'object') Paddle.Setup({ vendor: VENDOR_ID });

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/feeds" component={FeedsPage} />
      <Route path="/feed" component={FeedsPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route exact path="/terms" component={TermsPage} />
      <Route exact path="/privacy" component={PrivacyPage} />
      <Route component={UserPage} />
    </Switch>
    <NotificationContainer />
  </div>
);

export default App;
