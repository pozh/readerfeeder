import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';
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
              <p>ReaderFeeder is a service for Amazon Kindle owners which lets you aggregate your favorite
                feeds and have them delivered to your Kindle in a convenient, easy-to-navigate format.
                You Can also have your feeds delivered to your Kindle automatically on schedule.</p>
              <p>ReaderFeeder offers a free basic and a paid unlimited service. <Link to="/pricing">Click here</Link> to learn more.</p>
              <p>ReaderFeeder will never send any unsolicited content to your Kindle or your email address.</p>
            </div>
            <div className="col-md-7 px-5">
              <img src={require('assets/images/placeholder.png')} />
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
