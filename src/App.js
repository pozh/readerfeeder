import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotificationCenter from "./helpers/NotificationCenter";

import HomePage from './scenes/Home';
import LoginPage from './scenes/Auth/Login';
import FeedsPage from './scenes/Feeds';
import UserPage from './scenes/User';

const App = () => {
  return (
    <div>
      <NotificationCenter/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/feeds" component={FeedsPage}/>
        <Route path="/feed" component={FeedsPage}/>
        <Route exact path="/login" component={LoginPage}/>
        <Route component={UserPage}/>
      </Switch>
    </div>
  );
};

export default App;
