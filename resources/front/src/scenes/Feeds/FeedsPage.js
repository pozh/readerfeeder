import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Header, Footer, PageCaption } from 'components';
import FeedInfo from './FeedInfo';
import FeedList from './FeedList';
import Category from './Category';

import './styles.scss';

const FeedsPage = (props) => (
  <div>
    <Header />
    <Switch>
      <Route path="/browse" exact component={FeedList} />
      <Route path="/browse/:category/:slug" component={FeedInfo} />
      <Route path="/browse/:category" component={Category} />
    </Switch>
    <Footer />
  </div>
);

export default FeedsPage;
