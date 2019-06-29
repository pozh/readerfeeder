import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Header, Footer } from 'components';
import FeedInfo from './FeedInfo';
import FeedList from './FeedList';
import Category from './Category';

import './styles.scss';

const FeedsPage = () => (
  <DocumentTitle title="Browse Feeds - ReaderFeeder">
    <div>
      <Header className="white" />
      <Switch>
        <Route path="/feeds" exact component={FeedList} />
        <Route path={'/feeds/:category'} component={Category} />
        <Route path={'/feed/:slug'} component={FeedInfo} />
      </Switch>
      <Footer />
    </div>
  </DocumentTitle>
);

export default FeedsPage;
