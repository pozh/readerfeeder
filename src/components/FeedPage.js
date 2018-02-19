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
        <PageCaption caption={feed.title} extra="" />
        <Container className="mt-5">
          <Row>
            <Col sm="8">
              <div className="mb-5">{feed.description}</div>
              <FeedToc toc={items} />
            </Col>
            <Col>
              <p> </p>
            </Col>
          </Row>
        </Container>
        <Footer/>
      </div>
  )};
}

export default FeedPage;
