import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { FeedPage } from './components/FeedPage';
import { BrowsePage } from './components/BrowsePage';
import { NotFoundPage } from "./components/NotFoundPage";
import Storage from "./utils/Storage";


export class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/about" component={AboutPage}/>
          <Route exact path="/feeds" component={BrowsePage}/>
          <Route path="/feeds/:order(popular|recent|my)" component={BrowsePage}/>
          <Route path="/feeds/category/:slug" component={BrowsePage}/>
          <Route path="/feed/:slug" component={FeedPage}/>
        </div>
      </Router>
    );
  }
}
