import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {Container} from 'reactstrap';
import PageCaption from './../../components/PageCaption';
import SortCtrl from './SortCtrl';
import FeedCard from './FeedCard';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';


class FeedList extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.categories.length > 0) {
      this.props.actions.fetchAll('feed');
      this.props.actions.fetchAll('category');
    }
  }

  render() {
    let categories = this.props.categories;
    let feeds = this.props.feeds;

    let categorySlug = this.props.match.params.category;

    let order = this.props.match.params.order || 'categories';
    order = categorySlug ? 'category' : order;

    let category = categorySlug ? _.find(categories, {'slug': categorySlug}) : null;

    if (!feeds.length > 0 || !categories.length > 0 || (order === 'category') && !category) return (
      <main>
        <PageCaption>
          Browse Feeds
        </PageCaption>
        <Container>
          <h2>Loading...</h2>
        </Container>
      </main>
    );
    else return (
      <main>
        <PageCaption>
          Browse Feeds
          {order === 'category' && <small>{category.title}</small>}
        </PageCaption>

        <section className="Feeds pt-5">
          <Container>

            <SortCtrl order={order}/>

            <div className="Feeds-list">

              {/* Feeds by category, all categories*/}
              {(order === 'categories') && categories.map((category, cIndex) => (
                <div className="Feeds-section" key={cIndex}>
                  <h4 className="title">
                    <Link to={"/feeds/" + category.slug}>{category.title}</Link>
                  </h4>
                  <div className="Feeds-feeds">
                    {feeds.filter(feed => feed.category_id === category.id).map((feed, fIndex) =>
                      <FeedCard feed={feed} key={fIndex}/>
                    )}
                  </div>
                </div>
              ))}

              {/* Selected Category Feeds */}
              {categorySlug && (
                <div className="Feeds-feeds">
                  {feeds.filter(feed => feed.category_id === category.id)
                    .map((feed, idx) => <FeedCard feed={feed} key={idx}/>)}
                </div>
              )}

              {order === 'popular' && (
                <div className="Feeds-feeds">
                  {feeds.sort((a, b) => {
                    return b.subscribers - a.subscribers;
                  })
                    .map((feed, idx) => <FeedCard feed={feed} idx={idx + 1} key={idx}/>)}
                </div>
              )}

              {order === 'recent' && (
                <div className="Feeds-feeds">
                  {feeds.sort((a, b) => {
                    return b.id - a.id;
                  })
                    .map((feed, idx) => <FeedCard feed={feed} idx={idx + 1} key={idx}/>)}
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>
    );
  }
}


/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    categories: state.crud.items.categories,
    selectedItem: state.crud.selectedItem,
    subscriptions: state.crud.items.subscriptions,
    apiState: state.api
  }
}

/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
