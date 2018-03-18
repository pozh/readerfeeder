import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Footer from './../components/Footer';
import Header from './../components/Header';
import PageCaption from './../components/PageCaption';
import * as Auth from 'utils/Auth';
import './styles.scss';

export const SettingsPage = props => {
  if (!Auth.isAuthenticated()) return <Redirect to='/login'/>;
  else return (
    <div>
      <Header className="white" />
      <PageCaption>
        Settings
      </PageCaption>
      <div className="container">
        <h1>User settings page</h1>
      </div>
      <Footer/>
    </div>
  );
};

export default SettingsPage;
