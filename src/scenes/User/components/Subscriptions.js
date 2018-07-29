import React, { Component } from 'react';
import PageCaption from './../../components/PageCaption';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import FeedCard from 'scenes/Feeds/components/FeedCard';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';


class Subscriptions extends Component {

  componentWillMount() {
    if (!this.props.feeds.length > 0) this.props.actions.fetchAll('feed');
    if (!this.props.subscriptions.length > 0) this.props.actions.fetchAll('subscription');
  }

  render() {
    const subs = this.props.subscriptions;
    const allFeeds = this.props.feeds;
    const myFeeds = allFeeds.filter(feed => (
      _.findIndex(subs, sub => (sub.feed_id === feed.id)) >= 0)
    );

    return (
      <main>
        <PageCaption>Subscriptions</PageCaption>
        <div className="container">
          {!subs.length > 0 && (
            <div className="text-center">
              {this.props.apiState.isRequesting && <h3>Loading...</h3>}
              {!this.props.apiState.isRequesting && (
                <div>
                  <h3>No subscriptions yet</h3>
                  <p>
                    <br />
                    <Link className="btn btn-lg btn-round btn-primary" to="/feeds">Browse Feeds</Link>
                  </p>
                </div>
              )}
            </div>
          )}
          {subs.length > 0 && (
            <div className="Feeds-list pt-0">
              <div className="row Feeds-feeds">
                {myFeeds.map((feed, idx) => <FeedCard feed={feed} key={idx} />)}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}

/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    subscriptions: state.crud.items.subscriptions,
    apiState: state.api
  };
}

/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

/**
 * Connect the component to the Redux store.
 */
export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
