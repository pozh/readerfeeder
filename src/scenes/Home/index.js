import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import DocumentTitle from 'react-document-title';

import Footer from './../components/Footer';
import Header from './../components/Header';
import Hero from './components/Hero';
import { TITLE_HOME } from '../../constants/common';
import './styles.scss';

const HomePage = () => (
  <DocumentTitle title={TITLE_HOME}>
    <div>
      <Header light />
      <Hero />

      <section className="Intro">
        <Container>
          <Row className="align-items-center">
            <Col md="5">
              <img src={require('assets/images/placeholder.png')} />
            </Col>
            <Col md="7" className="px-5">
              <p className="h3">Collect</p>
              <p>Save and tag your online resources for easy access anytime, anywhere</p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md="5" className="order-12">
              <img src={require('assets/images/placeholder.png')} />
            </Col>
            <Col md="7" className="px-5">
              <p className="h3">Annotate</p>
              <p>Annotate web pages and PDF's directly as you browse online</p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md="5">
              <img src={require('assets/images/placeholder.png')} />
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
              <img src={require('assets/images/placeholder.png')} />
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
  </DocumentTitle>
);

export default HomePage;
