import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './../components/Footer';
import { Header } from './../components/Header';
import { PageCaption } from './../components/PageCaption';
import AppState from "../../utils/AppState";
import './styles.scss';

export const UserPage = props => {
  return (
    <div>
      <Header className="white" />
      <PageCaption>
        Browse Feeds
        {categorySlug && ' → ' + AppState.categoryBySlug(categorySlug).title}
      </PageCaption>
      <div className="container">
        <h1>User home page</h1>
      </div>
      <Footer/>
    </div>
  );
};
