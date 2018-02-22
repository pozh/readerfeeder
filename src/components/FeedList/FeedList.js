import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Storage from "./../../utils/Storage";
import { Container } from 'reactstrap';
import SortCtrl from "./SortCtrl";


class FeedList extends Component {

  state = {
    feeds: [],
    categories: []
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

    return (
      <section className="Feeds pt-5">
        <Container>

          <SortCtrl/>

          <div className="Feeds-list">
              { categories.map((category, cIndex) => (
                <div className="Feeds-section" key={cIndex}>
                  <h4 className="h5">
                    <Link to={ "/feeds/" + category.slug }>{ category.title }</Link>
                  </h4>
                  <div className="Feeds-feeds">
                    {
                      feeds.filter(feed => feed.category == category.id).map((feed, fIndex) => (
                        <div className="Feed" key={fIndex}>
                          <Link to={ "/feed/" + feed.slug } className="Feed-name">{ feed.title }</Link>
                          <div className="Feed-delivery">Delivery: daily</div>
                          <div className="Feed-actions">
                            <a href="javascript:" className="Feed-action">Send last issue</a>
                            <a href="javascript:" className="Feed-action">Subscribe</a>
                          </div>
                        </div>
                    )) }
                  </div>
                </div>
              )) }
            </div>
        </Container>
      </section>
    );
  }
}

export default FeedList;
