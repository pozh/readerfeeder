import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { Header, Footer } from './Layout';


export const HomePage = () => (
  <div>
    <Header />

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


    <section className="Intro">
      <Container>
        <Row className="align-items-center">
          <Col md="5">
            <img src={require("../assets/images/placeholder.png")} />
          </Col>
          <Col md="7" className="px-5">
            <p className="h3">Collect</p>
            <p>Save and tag your online resources for easy access anytime, anywhere</p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md="5" className="order-12">
            <img src={require("../assets/images/placeholder.png")} />
          </Col>
          <Col md="7" className="px-5">
            <p className="h3">Annotate</p>
            <p>Annotate web pages and PDF's directly as you browse online</p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md="5">
            <img src={require("../assets/images/placeholder.png")} />
          </Col>
          <Col md="7" className="px-5">
            <p className="h3">Organize</p>
            <p>Organize your links, references and personal input to create a structured research base through Outliner</p>
          </Col>
        </Row>
      </Container>
    </section>

    <section className="Intro-special">
      <Container>
        <Row className="align-items-center my-0">
          <Col md="5" className="order-12">
            <img src={require("../assets/images/placeholder.png")} />
          </Col>
          <Col md="7" className="px-5">
            <p className="h3">Share</p>
            <p>Share your research with friends, classmates, colleagues or associates</p>
          </Col>
        </Row>
      </Container>
    </section>

    <Footer />
  </div>
);

export default HomePage;
