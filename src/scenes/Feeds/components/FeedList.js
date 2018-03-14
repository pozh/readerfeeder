import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';
import AppState from '../../../utils/AppState';
import { Container } from 'reactstrap';
import SortCtrl from './SortCtrl';
import FeedCard from './FeedCard';
import { appConstants as constants } from '../../../constants/app';


/**
 * Import all apiAction and crudAction as an object.
 */
import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import * as flashMessage  from 'actions/flashMessage';

class FeedList extends Component {

  constructor(props) {
    super(props);
  }

  /*
  getFeedsData() {
    if (AppState.isEmpty) {
      axios.all([
        axios.get(constants.API_CATEGORIES),
        axios.get(constants.API_FEEDS)
      ])
        .then(axios.spread((gotCategories, gotFeeds) => {
          AppState.feeds = gotFeeds.data;
          AppState.categories = gotCategories.data;
          this.setState({
            feeds: gotFeeds.data,
            categories: gotCategories.data
          });
        }));
    } else {
      this.setState({
        feeds: AppState.feeds,
        categories: AppState.categories
      });
    }
  }
  /**/

  componentDidMount() {
    //this.getFeedsData();
  };

  render () {
    // let categories = this.state.categories.data;
    // let feeds = this.state.feeds.data;
    // let order = this.props.match.params.order || 'categories';
    // let categorySlug = this.props.match.params.category;
    // let category = categorySlug ? AppState.categoryBySlug(categorySlug) : null;
    if (true) {
      console.log(this.props);
      return (
        <Container>
          <h2>Loading...</h2>
        </Container>
      );
    } else return (
      <section className="Feeds pt-5">
        <Container>
          <SortCtrl order={order} />
          <div className="Feeds-list">

            {/* Feeds by category*/}
            {(!categorySlug && order === 'categories') && categories.map((category, cIndex) => (
              <div className="Feeds-section" key={cIndex}>
                <h4 className="title">
                  <Link to={ "/feeds/category/" + category.slug }>{ category.title }</Link>
                </h4>
                <div className="Feeds-feeds">
                  {feeds.filter(feed => feed.category_id === category.id).map((feed, fIndex) =>
                      <FeedCard feed={feed} key={fIndex}/>
                  )}
                </div>
              </div>
            ))}

            {/* Selected Category Feeds */}
            {category && (
              <div className="Feeds-feeds">
                {feeds.filter(feed => feed.category === category.id)
                  .map((feed, idx) => <FeedCard feed={feed} key={idx}/>)}
              </div>
            )}

            {order === 'popular' && (
              <div className="Feeds-feeds">
                {feeds.sort((a, b) => {return b.subscribers - a.subscribers;})
                  .map((feed, idx) => <FeedCard feed={feed} idx={idx+1} key={idx}/>)}
              </div>
            )}

            {order === 'recent' && (
              <div className="Feeds-feeds">
                {feeds.sort((a, b) => {return b.id - a.id;})
                  .map((feed, idx) => <FeedCard feed={feed} idx={idx+1} key={idx}/>)}
              </div>
            )}
            </div>
        </Container>
      </section>
    );
  }
}


/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    feeds: state.crud.feeds,
    apiState: state.api,
    message: state.flash.message
  }
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
