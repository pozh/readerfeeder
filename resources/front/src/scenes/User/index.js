import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import RequireAuth from 'utils/RequireAuth';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Subscriptions from './Home';
import Settings from './Settings';

import './styles.scss';

export default () => (
  <DocumentTitle title="Settings - ReaderFeeder">
    <div>
      <Header className="white" />
      <Switch>
        <Route path="/subscriptions" component={RequireAuth(Subscriptions)} />
        <Route path="/settings" component={RequireAuth(Settings)} />
      </Switch>
      <Footer />
    </div>
  </DocumentTitle>
);
