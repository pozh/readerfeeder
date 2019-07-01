import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import { isEmpty } from 'utils/commonUtil';
import { PageCaption, Loading } from 'components';
import FeedIcon from './components/FeedIcon';

// import FeedToc from './components/FeedToc';


class FeedInfo extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })),
    }),
    subscriptions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      feed_id: PropTypes.number.isRequired,
    })),
  };

  static defaultProps = {
    feed: {},
    subscriptions: [],
  };

  constructor(props) {
    super(props);
    this.onSubscribe = this.onSubscribe.bind(this);
  }

  componentWillMount() {
    const feed = this.props.feed;
    const slug = this.props.match.params.slug;

    if (isEmpty(feed) || feed.slug !== slug || !feed.items.length) {
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
              <FeedIcon />
              <h1>&nbsp;</h1>
            </div>
          </div>
          <div className="container mt-5">
            <div className="mt-5"><Loading /></div>
          </div>
        </main>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
        <main>
          <PageCaption title={feed.title} />
          {feed.items.length > 0 && (
            <section className="section">
              <div className="container">
                <p className="small mb-5">
                  Note: This is a preview of the feed.
                  Subscribe to it to get updates on your Kindle.
                </p>
                <div className="source">
                  {/* <h5 class="h6 border-bottom pb-1 mb-3">htmlspecialchars_
                  decode($source['title'])</h5> */}
                  <ul className="source__toc">
                    { feed.items.map(item => (
                      <li>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-weight-bold link-dark"
                        >{ item.title }</a>
                        <br />
                        <small className="text-muted">{ item.created_at }</small>
                      </li>
                    )) }
                  </ul>
                </div>
              </div>
            </section>
          )}

          <p className="text-center">
            {isSubscribed && <a href="#" onClick={this.onSubscribe} className="btn btn-lg btn-outline-secondary">Unsubscribe</a>}
            {!isSubscribed && <a href="#" onClick={this.onSubscribe} className="btn btn-lg btn-primary">Subscribe</a>}
          </p>
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
