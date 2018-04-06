import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';


class FeedCard extends Component {

  constructor(props) {
    super(props);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleSubscribe(event) {
    event.preventDefault();
    const feed = this.props.feed;
    const feedSubs = this.props.subscriptions.filter(sub => sub.feed_id === feed.id);
    if (feedSubs.length > 0)
      this.props.actions.unsubscribe(feedSubs[0].id); // unsubscribe, i.e. destroy the subscription in db by its ID
    else
      this.props.actions.subscribe(this.props.feed.id);
  }

  handleSend(event) {
    event.preventDefault();
  }

  render() {
    const feed = this.props.feed;
    const idx = this.props.idx;
    const isSubscribed = (this.props.subscriptions.filter(sub => sub.feed_id === feed.id).length > 0);
    const rootClassName = isSubscribed ? 'Feed subscribed' : 'Feed';
    const subAction = isSubscribed ? 'Unsubscribe' : 'Subscribe';
    return (
      <div className={rootClassName}>
        <Link to={"/feed/" + feed.slug} className="Feed-name">
          {idx && (<span className="Feed-order">{idx}. </span>)}
          {feed.title}
        </Link>
        {isSubscribed && <span className="Feed-subscribed">Subscribed</span>}
        <div className="Feed-delivery">Delivery: {feed.period}</div>
        <div className="Feed-actions">
          <a href="#" onClick={this.handleSend} className="Feed-action">Send last issue</a>
          <a href="#" onClick={this.handleSubscribe} className="Feed-action">{subAction}</a>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    apiState: state.api,
    subscriptions: state.crud.items.subscriptions
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedCard)
