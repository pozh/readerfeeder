import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import {TITLE_USER_SETTINGS} from "../../constants/common";
import Footer from './../components/Footer';
import Header from './../components/Header';
import RequireAuth from '../Auth/RequireAuth';
import Subscriptions from './components/Subscriptions';
import Settings from './components/Settings';
import Pro from './components/Pro';

import './styles.scss';

export const UserPage = props => {
  return (
    <DocumentTitle title={TITLE_USER_SETTINGS}>
    <div>
      <Header className="white"/>
      <Switch>
        <Route path="/subscriptions" component={RequireAuth(Subscriptions)}/>
        <Route path="/settings" component={RequireAuth(Settings)}/>
        <Route path="/pro" component={RequireAuth(Pro)}/>
      </Switch>
      <Footer/>
    </div>
    </DocumentTitle>
  );
};

export default UserPage;
