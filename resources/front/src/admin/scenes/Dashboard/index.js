import React from 'react';
import DocumentTitle from 'react-document-title';
import UserList from '../components/UserList';
import LogList from '../components/LogList';
import FeedList from '../components/Feeds/FeedList';
import Header from '../components/Header/Header';
import SideNav from '../components/Side/SideNav';
import Sidebar from '../components/Side/Sidebar';
import './styles.scss';

const Dashboard = () => (
  <DocumentTitle title="ReaderFeeder Admin Dashboard">
    <div className="dashboard">
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 col-lg-2">
            <Sidebar>
              <SideNav/>
            </Sidebar>
          </div>
          <div className="col">
            <Header/>
            <div className="row">
              <div className="col">
                <UserList/>
                <br/>
                <LogList/>
              </div>
              <div className="col">
                <FeedList/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DocumentTitle>
);

export default Dashboard;
