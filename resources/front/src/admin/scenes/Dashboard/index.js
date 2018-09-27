import React from 'react';
import DocumentTitle from 'react-document-title';
import UserList from './components/UserList';
import LogList from './components/LogList';
import FeedList from './components/FeedList';


const Dashboard = () => (
  <DocumentTitle title="RSS delivery service for Kindle Paperwhite, Voyage and Oasis - ReaderFeeder">
    <div>
      <div className="container-fluid pt-3">
        <h1 className="mb-3">ADMIN</h1>
        <div className="row">
          <div className="col-md-6">
            <UserList/>
            <LogList/>
          </div>
          <div className="col-md-6">
            <FeedList/>
          </div>
        </div>
      </div>
    </div>
  </DocumentTitle>
);

export default Dashboard;
