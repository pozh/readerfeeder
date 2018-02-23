import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import {Header, PageCaption, Footer} from './Layout';
import FeedToc from './Feed/FeedToc';


export class FeedPage extends Component {

  state = {
    feed: {}
  };


  getData() {
    axios.get('http://localhost:3000/feeds', {params: {slug: this.props.match.params.slug}})
      .then((res) => {
        this.setState({feed: res.data[0]});
        axios.get('http://localhost:3000/items', {params: {feed_id: res.data[0].id}})
          .then((res) => this.setState({items: res.data[0]}))
        }
      );
  };

  componentDidMount() {
    this.getData();
  };


  render () {
    const feed = this.state.feed;
    const items = this.state.items;

    return (
      <div>
        <Header className="white"/>
        <PageCaption>{feed.title}</PageCaption>
        <Container className="mt-5">
          <Row>
            <Col sm="9">
              {feed.description && (
                <div className="mb-5">{feed.description}</div>
              )}
              <div className="mb-5">
                <h3>Sources:</h3>
                <ul>
                  {feed.sources && feed.sources.map((source) => <li>{source.url}</li>)}
                </ul>
              </div>
              <FeedToc toc={items} />
            </Col>
            <Col>
              <p><a href="#" className="btn btn-lg btn-block btn-primary">Subscribe</a></p>
              <p><a href="#" className="btn btn-lg btn-block btn-secondary">Send current issue</a></p>
            </Col>
          </Row>
        </Container>
        <Footer/>
      </div>
  )};
}

export default FeedPage;
