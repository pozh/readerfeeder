import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';

import 'assets/styles/main.scss';

render((
  <Router>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/about" component={AboutPage} />
      {/* <Route path="/repos" component={Repos} /> */}
    </div>
  </Router>
), document.getElementById('app'));
