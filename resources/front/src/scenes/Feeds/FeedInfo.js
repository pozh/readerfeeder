import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import { isEmpty } from 'utils/commonUtil';
import { PageCaption, Loading } from 'components';

dayjs.extend(relativeTime);


class FeedInfo extends Component {
  constructor(props) {
    super(props);
    this.onSubscribe = this.onSubscribe.bind(this);
  }

  async componentWillMount() {
    const { feed, actions } = this.props;
    const { slug } = this.props.match.params;

    actions.fetchFeedItems(slug);

    if (isEmpty(feed) || feed.slug !== slug) {
      actions.fetchBySlug('feed', slug);
    }
  }

  onSubscribe(event) {
    event.preventDefault();
    const { feed, actions, subscriptions } = this.props;
    const feedSubs = subscriptions.filter(sub => sub.feed_id === feed.id);

    if (feedSubs.length > 0) {
      actions.unsubscribe(feedSubs[0].id);
    } else {
      actions.subscribe(feed.id);
    }
  }

  render() {
    const { feed, items, subscriptions } = this.props;
    const pageTitle = `${feed.title} - Kindle subscription - ReaderFeeder`;
    const itemsCount = items.length;
    const isSubscribed = (subscriptions.filter(
      sub => sub.feed_id === feed.id
    ).length > 0);

    if (!feed || this.props.match.params.slug !== feed.slug) {
      return (
        <DocumentTitle title="Browse Feeds - ReaderFeeder">
          <main>
            <PageCaption title=" " />
            <Loading />
          </main>
        </DocumentTitle>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
        <main>
          <PageCaption title={feed.title} />
          <p className="text-center mt-4">
            {isSubscribed && (
              <button
                type="button"
                href="#"
                onClick={this.onSubscribe}
                className="btn btn-lg btn-outline-secondary"
              >
                Unsubscribe
              </button>
            )}
            {!isSubscribed
            && <a href="#" onClick={this.onSubscribe} className="btn btn-lg btn-primary">Subscribe</a>}
          </p>
          {itemsCount > 0 && (
            <section className="section">
              <div className="container">
                <p className="small mb-5">
                  Note: This is a preview of the feed.
                  Subscribe to it to get updates on your Kindle.
                </p>
                <div className="source">
                  <ul className="list-unstyled source__toc">
                    {items.map(item => (
                      <li key={item.url}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-weight-bold link-dark"
                        >
                          {item.title}
                        </a>
                        <br />
                        <small className="text-muted">{dayjs.unix(item.timestamp).fromNow()}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
          {!itemsCount > 0 && (
            <Loading />
          )}
        </main>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  return {
    feed: state.crud.selectedItem.feed,
    subscriptions: state.crud.items.subscriptions,
    items: state.crud.items.items,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedInfo);
