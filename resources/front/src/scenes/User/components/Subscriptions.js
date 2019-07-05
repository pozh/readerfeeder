import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import { Header, PageCaption, SectionTitle, Loading } from 'components';
import FeedCard from 'scenes/Feeds/components/FeedCard';


class Subscriptions extends Component {
  static defaultProps = {
    feeds: null,
    categories: null,
    subscriptions: null,
  };

  componentWillMount() {
    if (!this.props.feeds.length > 0) this.props.actions.fetchAll('feed');
    if (!this.props.categories.length > 0) this.props.actions.fetchAll('category');
    if (!this.props.subscriptions.length > 0) this.props.actions.fetchAll('subscription');
  }

  render() {
    const subs = this.props.subscriptions;
    const allFeeds = this.props.feeds;
    const myFeeds = allFeeds.filter(feed => (
      _.findIndex(subs, sub => (sub.feed_id === feed.id)) >= 0)
    );

    return (
      <div>
        <Header />
        <PageCaption title="My ReaderFeeder" />
        <div className="container">
          <section className="section subscriptions">
            <SectionTitle>Subscriptions</SectionTitle>
            {!subs.length > 0 && (
              <div className="text-center">
                {this.props.apiState.isRequesting && <Loading />}
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
          </section>
          <section className="section">
            <SectionTitle>Custom RSS Feeds</SectionTitle>
            <Link to="/" className="btn btn-secondary">Add Feed</Link>
          </section>
        </div>
      </div>
    );
  }
}

Subscriptions.propTypes = {
  feeds: PropTypes.arrayOf(PropTypes.object),
  subscriptions: PropTypes.arrayOf(PropTypes.object),
};

/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    categories: state.crud.items.categories,
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
