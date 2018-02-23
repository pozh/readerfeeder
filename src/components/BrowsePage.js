import React from 'react';
import { Link } from 'react-router-dom';
import {Header, PageCaption, Footer} from './Layout';
import FeedList from "./FeedList/FeedList";
import Storage from "../utils/Storage";

import './../assets/styles/components/browse.scss';

export const BrowsePage = props => {
  const categorySlug = props.match.params.category;
  return (
    <div>
      <Header className="white" />
      <PageCaption>
        Browse Feeds
        {categorySlug && ' → ' + Storage.categoryBySlug(categorySlug).title}
      </PageCaption>
      <FeedList { ...props } />
      <Footer/>
    </div>
  );
}
