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
    return (
      <div className={rootClassName}>
        <Link to={"/feed/" + feed.slug} className="Feed-name">
          {idx && (<span className="Feed-order">{idx}. </span>)}
          {feed.title}
        </Link>
        <div className="Feed-functions">
          <div className="Feed-delivery"><img className="Feed-delivery-icon" src={require("assets/images/ico_delivery.png")} alt=""/>{feed.period}</div>

          <div className="Feed-actions">
            {isSubscribed && <a href="#" onClick={this.handleSubscribe} className="Feed-action Feed-action-subscribe">Unsubscribe</a>}
            {!isSubscribed && <a href="#" onClick={this.handleSubscribe} className="Feed-action Feed-action-unsubscribe">Subscribe</a>}
            <a href="#" onClick={this.handleSend} className="Feed-action Feed-action-send">Send to Kindle</a>
          </div>
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
