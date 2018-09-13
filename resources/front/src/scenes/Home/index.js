import React from 'react';
import DocumentTitle from 'react-document-title';
import Footer from './../components/Footer';
import Header from './../components/Header';
import Hero from './components/Hero';
import './styles.scss';

const HomePage = () => (
  <DocumentTitle title="RSS delivery service for Kindle Paperwhite, Voyage and Oasis - ReaderFeeder">
    <div>
      <Header light />
      <Hero />

      <section className="Intro">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <img src={require('assets/images/placeholder.png')} />
            </div>
            <div className="col-md-7 px-5">
              <p className="h3">Collect</p>
              <p>Save and tag your online resources for easy access anytime, anywhere</p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5 order-12">
              <img src={require('assets/images/placeholder.png')} />
            </div>
            <div className="col-md-7 px-5">
              <p className="h3">Annotate</p>
              <p>Annotate web pages and PDF's directly as you browse online</p>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <img src={require('assets/images/placeholder.png')} />
            </div>
            <div className="col-md-7 px-5">
              <p className="h3">Organize</p>
              <p>Organize your links, references and personal input to create a structured research base through Outliner</p>
            </div>
          </div>
        </div>
      </section>

      <section className="Intro-special">
        <div className="container">
          <div className="row align-items-center my-0">
            <div className="col-md-5 order-12">
              <img src={require('assets/images/placeholder.png')} />
            </div>
            <div className="col-md-7 px-5">
              <p className="h3">Share</p>
              <p>Share your research with friends, classmates, colleagues or associates</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </DocumentTitle>
);

export default HomePage;
