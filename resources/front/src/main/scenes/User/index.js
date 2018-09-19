import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import RequireAuth from 'utils/RequireAuth';
import Footer from './../components/Footer';
import Header from './../components/Header';
import Subscriptions from './components/Subscriptions';
import Settings from './components/Settings';
import Pricing from './components/Pricing';

import './styles.scss';

export const UserPage = () => (
  <DocumentTitle title="Settings - ReaderFeeder">
    <div>
      <Header className="white" />
      <Switch>
        <Route path="/subscriptions" component={RequireAuth(Subscriptions)} />
        <Route path="/settings" component={RequireAuth(Settings)} />
        <Route path="/pricing" component={Pricing} />
      </Switch>
      <Footer />
    </div>
  </DocumentTitle>
);

export default UserPage;
