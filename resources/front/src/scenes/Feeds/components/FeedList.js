import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import PageCaption from '../../../components/PageCaption';
import Loading from '../../../components/Loading';
import SortCtrl from './SortCtrl';
import FeedCard from './FeedCard';

class FeedList extends Component {
  componentWillMount() {
    if (!this.props.categories.length > 0) {
      this.props.actions.fetchAll('feed');
      this.props.actions.fetchAll('category');
    }
    if (this.props.isAuthenticated && this.props.subscriptions.length === 0) {
      this.props.actions.fetchAll('subscription');
    }
  }

  render() {
    const categories = this.props.categories;
    const feeds = this.props.feeds;

    const categorySlug = this.props.match.params.category;

    let order = this.props.match.params.order || 'categories';
    order = categorySlug ? 'category' : order;

    const category = categorySlug ? _.find(categories, { slug: categorySlug }) : null;

    if (!feeds.length > 0 || !categories.length > 0 || (order === 'category') && !category) {
      return (
        <main>
          <PageCaption>Browse Feeds</PageCaption>
          <section className="Feeds pt-5">
            <div className="container page-height">
              <Loading/>
            </div>
          </section>
        </main>
      );
    }
    return (
      <main>
        <PageCaption>
          Browse Feeds
          {order === 'category' && <small>{category.title}</small>}
        </PageCaption>

        <section className="Feeds pt-5">
          <div className="container">
            <SortCtrl order={order} />

            <div className="Feeds-list">

              {/* Feeds by category, all categories */}
              {(order === 'categories') && categories.map(eachCategory => (
                <div className="Feeds-section" key={eachCategory.id}>
                  <h4 className="title">
                    <Link to={`/feeds/${eachCategory.slug}`}>{eachCategory.title}</Link>
                  </h4>
                  <div className="row Feeds-feeds">
                    {feeds.filter(feed => feed.category_id === eachCategory.id).map(feed =>
                      <FeedCard feed={feed} key={feed.id} />
                    )}
                  </div>
                </div>
              ))}

              {/* Selected Category Feeds */}
              {categorySlug && (
                <div className="row Feeds-feeds">
                  {feeds.filter(feed => feed.category_id === category.id)
                    .map(feed => <FeedCard feed={feed} key={feed.id} />)}
                </div>
              )}

              {order === 'popular' && (
                <div className="row Feeds-feeds">
                  {feeds.sort((a, b) => b.subscribers - a.subscribers)
                    .map((feed, idx) => <FeedCard feed={feed} idx={idx + 1} key={feed.id} />)}
                </div>
              )}

              {order === 'recent' && (
                <div className="row Feeds-feeds">
                  {feeds.sort((a, b) => b.id - a.id)
                    .map((feed, idx) => <FeedCard feed={feed} idx={idx + 1} key={feed.id} />)}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

FeedList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  isAuthenticated: PropTypes.bool
};

FeedList.defaultProps = {
  categories: {},
  isAuthenticated: false
};

function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    categories: state.crud.items.categories,
    selectedItem: state.crud.selectedItem,
    subscriptions: state.crud.items.subscriptions,
    isAuthenticated: state.auth.isAuthenticated,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
