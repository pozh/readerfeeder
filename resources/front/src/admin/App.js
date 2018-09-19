import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import RequireAuth from 'utils/RequireAuth';
import Dashboard from './scenes/Dashboard';
import LoginPage from 'scenes/Auth/Login';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={RequireAuth(Dashboard)} />
      <Route exact path="/login" component={LoginPage} />
    </Switch>
    <NotificationContainer />
  </div>
);

export default App;
