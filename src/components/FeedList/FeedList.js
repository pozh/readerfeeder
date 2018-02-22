import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Storage from "./../../utils/Storage";
import { Container } from 'reactstrap';
import SortCtrl from "./SortCtrl";
import FeedCard from "./FeedCard";

class FeedList extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    feeds: [],
    categories: [],
    order: ''
  };

  getFeedsData() {
    if (Storage.isEmpty) {
      axios.all([
        axios.get('http://localhost:3000/categories'),
        axios.get('http://localhost:3000/feeds')
      ])
        .then(axios.spread((gotCategories, gotFeeds) => {
          Storage.feeds = gotFeeds.data;
          Storage.categories = gotCategories.data;
          this.setState({
            feeds: gotFeeds.data,
            categories: gotCategories.data
          });
        }));
    } else {
      this.setState({
        feeds: Storage.feeds,
        categories: Storage.categories
      });
    }
  }

  componentDidMount() {
    this.getFeedsData();
  };

  render () {
    let categories = this.state.categories;
    let feeds = this.state.feeds;
    let order = this.props.match.params.order || 'categories';

    return (
      <section className="Feeds pt-5">
        <Container>
          <SortCtrl order={order} />
          <div className="Feeds-list">

            {order === 'categories' && categories.map((category, cIndex) => (
              <div className="Feeds-section" key={cIndex}>
                <h4 className="h5">
                  <Link to={ "/feeds/category/" + category.slug }>{ category.title }</Link>
                </h4>
                <div className="Feeds-feeds">
                  {feeds.filter(feed => feed.category == category.id).map((feed, fIndex) =>
                      <FeedCard feed={feed} key={fIndex}/>
                  )}
                </div>
              </div>
            ))}

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

export default FeedList;
