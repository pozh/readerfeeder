import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';

import 'assets/styles/main.scss';

render((
  <Router>
    <Route path="/" component={HomePage} />
    {/* <Route path="/repos" component={Repos} /> */}
    {/* <Route path="/about" component={About} /> */}
  </Router>
), document.getElementById('app'));
