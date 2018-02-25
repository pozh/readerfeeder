import React from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap';

export const Hero = props => (
  <section className="Hero bg-light">
    <Container>
      <Row>
        <Col md="7">
          <h1 className="Hero-heading">RSS Delivery Service for KINDLE</h1>
          <h4 className="Hero-subheading">
            ReaderFeeder delivers RSS feeds in full-text format to your
            Kindle e-reader, wirelessly, on schedule.
          </h4>
          <div className="Hero-actions">
            <Link className="btn btn-lg btn-round btn-primary" to="/feeds">Selected Feeds</Link>
          </div>
        </Col>
        <Col md="5">
          <img src={require("assets/images/news.png")} alt="" />
        </Col>
      </Row>
    </Container>
  </section>
);

export default Hero;
