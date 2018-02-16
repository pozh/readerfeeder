import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { BrowsePage } from './components/BrowsePage';
import { NotFoundPage } from "./components/NotFoundPage";

import 'assets/styles/main.scss';

render((
  <Router>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/feeds" component={BrowsePage} />

      {/* this is for /feeds/category-slug */}
      <Route path="/feeds/:slug" component={NotFoundPage} />

      {/* this is for individual feed page */}
      <Route path="/feed/:slug" component={NotFoundPage} />
    </div>
  </Router>
), document.getElementById('app'));
