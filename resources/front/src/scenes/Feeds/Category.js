import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import _find from 'lodash/find';
import _assign from 'lodash/assign';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import { SectionTitle, Loading } from 'components';
import FeedCard from './components/FeedCard';


class FeedList extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    feeds: PropTypes.arrayOf(PropTypes.object),
    isAuthenticated: PropTypes.bool,
  };

  static defaultProps = {
    categories: {},
    subscriptions: {},
    feeds: {},
    isAuthenticated: false
  };

  componentDidMount() {
    const {
      categories,
      actions,
      subscriptions,
      isAuthenticated
    } = this.props;

    if (!categories.length > 0) {
      actions.fetchAll('feed');
      actions.fetchAll('category');
    }
    if (isAuthenticated && subscriptions.length === 0) {
      actions.fetchAll('subscription');
    }
  }

  render() {
    const {
      categories,
      feeds,
      match
    } = this.props;

    const categorySlug = match.params.category;

    let order = match.params.order || 'categories';
    order = categorySlug ? 'category' : order;

    const category = categorySlug ? _find(categories, { slug: categorySlug }) : null;
    const needLoader = !feeds.length > 0 || !categories.length > 0 || (order === 'category' && !category);
    const categoryTitle = category ? `${category.title} - browse RSS Feeds to read on Kindle - ReaderFeeder`
      : 'Browse RSS Feeds to read on Kindle - ReaderFeeder';

    return (
      <DocumentTitle title={categoryTitle}>
        <main>
          {needLoader && <Loading />}
          {!needLoader && (
            <div>
              <div
                className="section hero-cat d-flex"
                style={{ backgroundImage: `url(/assets/images/cat-lg-${category.slug}.jpg)` }}
              >
                <div className="container align-self-end">
                  <h2 className="text-white mb-4 font-weight-normal">{category.title}</h2>
                </div>
              </div>

              <section className="section">
                <div className="container">
                  <SectionTitle>Top feeds</SectionTitle>
                  <div className="row">
                    {feeds.filter(feed => feed.category_id === category.id).map(
                      feed => <FeedCard feed={feed} key={feed.id} />
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </DocumentTitle>
    );
  }
}

function stateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    categories: state.crud.items.categories,
    selectedItem: state.crud.selectedItem,
    subscriptions: state.crud.items.subscriptions,
    isAuthenticated: state.auth.isAuthenticated,
    apiState: state.api
  };
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(FeedList);
