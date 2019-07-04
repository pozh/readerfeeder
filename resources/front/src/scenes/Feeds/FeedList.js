import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import find from 'lodash/find';
import assign from 'lodash/assign';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import { PageCaption, SectionTitle, Loading } from 'components';

import FeedCard from './components/FeedCard';


class FeedList extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    feeds: PropTypes.arrayOf(PropTypes.object),
    isAuthenticated: PropTypes.bool,
  };

  static defaultProps = {
    categories: [],
    subscriptions: [],
    feeds: [],
    isAuthenticated: false
  };

  componentWillMount() {
    const {
      categories,
      actions,
      isAuthenticated,
      subscriptions
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
    const { categories, feeds } = this.props;
    const categorySlug = this.props.match.params.category;
    let order = this.props.match.params.order || 'categories';
    order = categorySlug ? 'category' : order;

    const category = categorySlug ? find(categories, { slug: categorySlug }) : null;

    if (!feeds.length > 0 || !categories.length > 0 || (order === 'category') && !category) {
      return (
        <main>
          <Loading />
        </main>
      );
    } return (
      <main>
        <PageCaption
          title="RSS Feeds"
          caption="Full text feeds for Kindle, Kindle Touch, Paperwhite, Oasis &amp; Voyage"
        >
          <p className="text-center lead mt-2">
            Subscribe to any of the RSS Feeds listed below,
            and ReaderFeeder will start delivering them right to your Kindle.
          </p>
        </PageCaption>
        <section className="section">
          <div className="container">
            <SectionTitle>Categories</SectionTitle>
            <div className="row">
              {categories.map(cat => (
                <div className="col-md-6 col-lg-3 mb-5" key={cat.id}>
                  <Link to={`/feeds/${cat.slug}`} className="link-dark">
                    <div className="cat-img" style={{ backgroundImage: `url(/assets/images/cat-${cat.slug}.jpg)` }} />
                    <h6 className="mt-2 mb-0 text-uppercase">{cat.title}</h6>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionTitle>Popular feeds</SectionTitle>
            <div className="row">
              {feeds.sort((a, b) => b.subscribers - a.subscribers).slice(0, 12).map(feed => (
                <FeedCard feed={feed} key={feed.id} />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

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
    actions: bindActionCreators(assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
