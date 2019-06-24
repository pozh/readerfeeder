import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import { isEmpty } from 'utils/commonUtil';
import Loading from '../../components/Loading';
import FeedIcon from './components/FeedIcon';
import FeedToc from './components/FeedToc';


class FeedInfo extends Component {
  constructor(props) {
    super(props);
    this.onSubscribe = this.onSubscribe.bind(this);
  }

  componentWillMount() {
    const feed = this.props.feed;
    const slug = this.props.match.params.slug;

    if (isEmpty(feed) || feed.slug !== slug) {
      this.props.actions.fetchBySlug('feed', slug);
    }
  }

  onSubscribe(event) {
    event.preventDefault();
    const feed = this.props.feed;
    const feedSubs = this.props.subscriptions.filter(sub => sub.feed_id === feed.id);

    if (feedSubs.length > 0) {
      this.props.actions.unsubscribe(feedSubs[0].id);
    } else {
      this.props.actions.subscribe(this.props.feed.id);
    }
  }

  render() {
    const feed = this.props.feed;
    const pageTitle = `${feed.title} - Kindle subscription - ReaderFeeder`;
    const isSubscribed = (this.props.subscriptions.filter(
        sub => sub.feed_id === feed.id).length > 0
    );

    if (!feed || this.props.match.params.slug !== feed.slug) {
      return (
        <main>
          <div className="feedinfo__pagetitle">
            <div className="container">
              <FeedIcon/>
              <h1>&nbsp;</h1>
            </div>
          </div>
          <div className="container mt-5">
            <div className="mt-5"><Loading/></div>
          </div>
        </main>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
        <main>
          <div className="feedinfo__pagetitle">
            <div className="container d-flex align-items-center justify-content-center">
              <FeedIcon/>
              <h1 className="">{feed.title}</h1>
            </div>
          </div>
          <div className="container pt-5">
            <div className="row">
              <div className="col-md-3 order-md-12">
                <p>
                  {isSubscribed && <a href="#" onClick={this.onSubscribe} className="btn btn-lg btn-block btn-outline-secondary">Unsubscribe</a>}
                  {!isSubscribed && <a href="#" onClick={this.onSubscribe} className="btn btn-lg btn-block btn-primary">Subscribe</a>}
                </p>
              </div>
              <div className="col-md-9 mt-4 mt-md-7 order-md-0">
                {feed.description && (
                  <div className="mb-5">{feed.description}</div>
                )}
                {feed.items && (
                  <div>
                    <h2 className="mb-4">In this issue:</h2>
                    <FeedToc items={feed.items} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr className="mt-5"/>
        </main>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  return {
    feed: state.crud.selectedItem.feed,
    subscriptions: state.crud.items.subscriptions,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedInfo);
