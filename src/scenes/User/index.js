import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import Footer from './../components/Footer';
import Header from './../components/Header';
import RequireAuth from '../Auth/RequireAuth';
import Subscriptions from './components/Subscriptions';

import './styles.scss';

export const UserPage = props => (

  <div>
    <Header className="white"/>
    <Switch>
      <Route path="/subscriptions" component={RequireAuth(Subscriptions)}/>
    </Switch>
    <Footer/>
  </div>
);

export default UserPage;
