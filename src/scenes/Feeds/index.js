import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './../components/Footer';
import { Header } from './../components/Header';
import { PageCaption } from './../components/PageCaption';

import FeedList from "./components/FeedList";
import Storage from "../../utils/Storage";

import './styles.scss';

export const FeedsPage = props => {
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
