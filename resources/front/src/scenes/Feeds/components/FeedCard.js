import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import './feedcard.scss';

class FeedCard extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      slug: PropTypes.string,
      period: PropTypes.string,
    }),
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.object,
  };

  static defaultProps = {
    feed: {},
    subscriptions: [],
    actions: {},
  };

  constructor(props) {
    super(props);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleSubscribe(event) {
    event.preventDefault();
    const { feed, subscriptions, actions } = this.props;
    const feedSubs = subscriptions.filter(sub => sub.feed_id === feed.id);

    // unsubscribe, i.e. destroy the subscription in db by its ID
    if (feedSubs.length > 0) {
      actions.unsubscribe(feedSubs[0].id);
    } else {
      actions.subscribe(feed.id);
    }
  }

  handleSend(event) {
    event.preventDefault();
  }

  render() {
    const { feed, subscriptions, categories } = this.props;
    const isSubscribed = subscriptions.filter(
      sub => sub.feed_id === feed.id
    ).length > 0;
    const category = categories.filter(c=>c.id===feed.category_id)[0];
    const rootClassName = isSubscribed ? 'feed d-flex subscribed' : 'feed d-flex';

    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className={rootClassName} key={feed.id}>
          <div className="feed__icon mr-2" />
          <div className="feed__info">
            <Link to={`/feeds/${category.slug}/${feed.slug}`} className="link-dark font-weight-bold">{ feed.title }</Link>
            <div className="small">{ `${feed.period} delivery` }</div>
            <div className="feed__actions mt-2 text-right pt-1">
              {isSubscribed && <button onClick={this.handleSubscribe} className="feed__action feed__action-subscribe">Unsubscribe</button>}
              {!isSubscribed && <button onClick={this.handleSubscribe} className="feed__action feed__action-unsubscribe">Subscribe</button>}
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
    subscriptions: state.crud.items.subscriptions,
    categories: state.crud.items.categories,
  };
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(FeedCard);
