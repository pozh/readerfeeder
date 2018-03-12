import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './scenes/Home';
import LoginPage from './scenes/Auth/Login';
import SignupPage from './scenes/Auth/Signup';
import UserPage from './scenes/User';
import SettingsPage from './scenes/Settings';
import FeedInfo from './scenes/FeedInfo';
import FeedsPage from './scenes/Feeds';
// import { NotFoundPage } from "./scenes/NotFound";


export class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/signup" component={SignupPage}/>
          <Route exact path="/feeds" component={FeedsPage}/>
          <Route exact path="/user" component={UserPage}/>
          <Route exact path="/settings" component={SettingsPage}/>
          <Route path="/subscriptions" component={FeedsPage}/>
          <Route path="/feeds/:order(popular|recent)" component={FeedsPage}/>
          <Route path="/feeds/category/:category" component={FeedsPage}/>
          <Route path="/feed/:slug" component={FeedInfo}/>
        </div>
      </Router>
    );
  }
}
