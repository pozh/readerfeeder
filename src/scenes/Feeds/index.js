import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Footer from './../components/Footer';
import Header from './../components/Header';
import PageCaption from './../components/PageCaption';
import FeedInfo from './components/FeedInfo';
import FeedList from "./components/FeedList";

import './styles.scss';

export const FeedsPage = props => {

  const path = props.match.path;

  return (
    <div>
      <Header className="white" />
      <PageCaption>Browse Feeds</PageCaption>
      <Switch>
        <Route path={path} exact component={FeedList}/>
        <Route path={`${path}/:order(popular|recent)`} component={FeedList}/>
        <Route path={`${path}/category/:category`} component={FeedList}/>
        <Route path={`${path}/:slug`} component={FeedInfo}/>
      </Switch>
      <Footer/>
    </div>
  );
};

export default FeedsPage;
