import React, { Component } from 'react';
import axios from 'axios';


class FeedList extends Component {

  state = {
    feeds: [],
    categories: []
  };

  getData() {
    axios.get('http://localhost:3000/db')
      .then(res => {
        this.setState({
          feeds: res.data.feeds,
          categories: res.data.categories
        });
      });
  }

  componentDidMount() {
    this.getData();
  };

  render () {
    const categories  = this.state.categories;
    const feeds  = this.state.feeds;
    return (
      <div className="Feeds-list">
        { categories.map((category, cIndex) => (
          <div className="Feeds-section" key={cIndex}>
            <h4 className="h5">{ category.title }</h4>
            <div className="Feeds-feeds">
              {
                feeds.filter(feed => feed.category == category.id).map((feed, fIndex) => (
                  <div className="Feed" key={fIndex}>
                    <a href="/newspaper/fast-company" className="Feed-name">{ feed.title }</a>
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
    );
  }
}

export default FeedList;
