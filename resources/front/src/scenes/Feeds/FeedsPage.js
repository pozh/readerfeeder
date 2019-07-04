import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header, Footer } from 'components';
import FeedInfo from './FeedInfo';
import FeedList from './FeedList';
import Category from './Category';

import './styles.scss';

const FeedsPage = () => (
  <div>
    <Header />
    <Switch>
      <Route path="/feeds" exact component={FeedList} />
      <Route path="/feeds/:category" component={Category} />
      <Route path="/feed/:slug" component={FeedInfo} />
    </Switch>
    <Footer />
  </div>
);

export default FeedsPage;
