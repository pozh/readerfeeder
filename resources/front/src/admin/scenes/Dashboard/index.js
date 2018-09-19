import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
import UserList from './components/UserList';
import FeedList from './components/FeedList';


const Dashboard = () => (
  <DocumentTitle title="RSS delivery service for Kindle Paperwhite, Voyage and Oasis - ReaderFeeder">
    <div>
      <div className="container pt-5">
        <h1>ADMIN</h1>
        <hr/>
        <h4 className="text-right">
          <Link to="users">Users</Link> | <Link to="feeds">Feeds</Link>
        </h4>
        <UserList/>
        <FeedList className="mt-5"/>
      </div>
    </div>
  </DocumentTitle>
);

export default Dashboard;
