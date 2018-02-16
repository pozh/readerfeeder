import React from 'react';
import { Link } from 'react-router-dom';
import {Header, PageCaption, Footer} from './Layout';
import FeedList from "./FeedList/FeedList";

import './../assets/styles/components/browse.scss';

export const BrowsePage = props => (
  <div>
    <Header className="white" />
    <PageCaption caption="Subscribe to Feeds" extra="" />
    <FeedList/>
    <Footer/>
  </div>
);

export default BrowsePage;
