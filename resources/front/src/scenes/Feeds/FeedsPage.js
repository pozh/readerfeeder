import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import FeedInfo from './FeedInfo';
import FeedList from './components/FeedList';

import './styles.scss';

const FeedsPage = () => (
  <DocumentTitle title="Browse Feeds - ReaderFeeder">
    <div>
      <Header className="white" />
      <Switch>
        <Route path="/feeds" exact component={FeedList} />
        <Route path={'/feeds/:order(popular|recent)'} component={FeedList} />
        <Route path={'/feeds/:category'} component={FeedList} />
        <Route path={'/feed/:slug'} component={FeedInfo} />
      </Switch>
      <Footer />
    </div>
  </DocumentTitle>
);

export default FeedsPage;
