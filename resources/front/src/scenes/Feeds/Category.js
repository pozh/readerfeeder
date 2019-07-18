import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

    const category = categorySlug ? _find(categories, { slug: categorySlug }) : null;

    if (!feeds.length > 0 || !categories.length > 0 || (order === 'category') && !category) {
      return (
        <main>
          <Loading />
        </main>
      );
    } return (
      <main>
        <div
          className="section hero-cat d-flex"
          style={{ backgroundImage: `url(/assets/images/cat-lg-${category.slug}.jpg)` }}
        >
          <div className="container align-self-end">
            <h2 className="text-white mb-4 font-weight-normal">{ category.title }</h2>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <SectionTitle>Top feeds</SectionTitle>
            <div className="row">
              {feeds.filter(feed => feed.category_id === category.id).map(feed =>
                <FeedCard feed={feed} key={feed.id} />
              )}
            </div>
          </div>
        </section>
      </main>
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
