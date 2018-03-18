import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Footer from './../components/Footer';
import Header from './../components/Header';
import FeedInfo from './components/FeedInfo';
import FeedList from "./components/FeedList";

import './styles.scss';

export const FeedsPage = props => {

  return (
    <div>
      <Header className="white" />
      <Switch>
        <Route path='/feeds' exact component={FeedList}/>
        <Route path={'/feeds/:order(popular|recent)'} component={FeedList}/>
        <Route path={'/feeds/:category'} component={FeedList}/>
        <Route path={'/feed/:slug'} component={FeedInfo}/>
      </Switch>
      <Footer/>
    </div>
  );
};

export default FeedsPage;
