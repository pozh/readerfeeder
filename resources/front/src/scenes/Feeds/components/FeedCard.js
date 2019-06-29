import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';


class FeedCard extends Component {
  static propTypes = {
    feed: PropTypes.Object,
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    feed: {},
    subscriptions: {},
    actions: {},
  };

  constructor(props) {
    super(props);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleSubscribe(event) {
    event.preventDefault();
    const feed = this.props.feed;
    const feedSubs = this.props.subscriptions.filter(sub => sub.feed_id === feed.id);

    // unsubscribe, i.e. destroy the subscription in db by its ID
    if (feedSubs.length > 0) {
      this.props.actions.unsubscribe(feedSubs[0].id);
    } else {
      this.props.actions.subscribe(this.props.feed.id);
    }
  }

  handleSend(event) {
    event.preventDefault();
  }

  render() {
    const feed = this.props.feed;
    const isSubscribed = this.props.subscriptions.filter(
      sub => sub.feed_id === feed.id).length > 0;
    const rootClassName = isSubscribed ? 'feed d-flex subscribed' : 'feed d-flex';
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className={rootClassName} key={feed.id}>
          <div className="feed__icon mr-2" />
          <div className="feed__info">
            <Link to={`/feed/${feed.slug}`} className="link-dark font-weight-bold">{ feed.title }</Link>
            <div className="small">{ feed.period } delivery</div>
            <div className="feed__actions mt-2 text-right pt-1">
              {isSubscribed && <a href="#" onClick={this.handleSubscribe} className="feed__action feed__action-subscribe">Unsubscribe</a>}
              {!isSubscribed && <a href="#" onClick={this.handleSubscribe} className="feed__action feed__action-unsubscribe">Subscribe</a>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function stateToProps(state) {
  return {
    apiState: state.api,
    subscriptions: state.crud.items.subscriptions
  };
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(FeedCard);
