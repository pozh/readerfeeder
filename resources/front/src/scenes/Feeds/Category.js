import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import find from 'lodash/find';
import assign from 'lodash/assign';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import { SectionTitle, Loading } from 'components';


class FeedList extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    feeds: PropTypes.arrayOf(PropTypes.object),
    isAuthenticated: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    categories: {},
    subscriptions: {},
    feeds: {},
    actions: {},
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

    const category = categorySlug ? find(categories, { slug: categorySlug }) : null;

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
              {feeds.filter(feed => feed.category_id === category.id).map(feed => (
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feed d-flex align-items-center" key={feed.id}>
                    <div className="feed__icon mr-2" />
                    <div className="feed__info">
                      <Link to={feed.slug} className="link-dark font-weight-bold">{ feed.title }</Link>
                      <div className="small">Delivery: { feed.period }</div>
                    </div>
                  </div>
                  {/* <FeedCard feed={feed} idx={idx + 1} key={feed.id} /> */}
                </div>
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
