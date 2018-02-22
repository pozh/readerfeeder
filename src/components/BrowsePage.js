import React from 'react';
import { Link } from 'react-router-dom';
import {Header, PageCaption, Footer} from './Layout';
import FeedList from "./FeedList/FeedList";

import './../assets/styles/components/browse.scss';

export const BrowsePage = props => {
  return (
    <div>
      <Header className="white" />
      <PageCaption caption="Subscribe to Feeds" extra="" />
      <FeedList { ...props } />
      <Footer/>
    </div>
  );
}
