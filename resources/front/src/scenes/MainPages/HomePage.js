import React from 'react';
import { Header, Footer } from 'components';

const HomePage = () => (
  <div>
    <Header />
    <div className="section" style={{ overflowX: 'hidden' }}>
      <div className="container d-flex align-content-center hero">
        <div className="row align-content-center">
          <div className="col-lg-6">
            <h1 className="hero__title">
              Read your favorite RSS feeds offline, in the sun!
              <span className="d-block d-lg-none">
                <img width="65%" src="/assets/images/hero.svg" alt="" className="mt-3" />
              </span>
            </h1>
            <h2 className="h5 font-weight-bold pr-xl-8">
              Follow your favorite blogs, sites &amp; news portals —
              read them all from the comfort of your Kindle Paperwhite!
              <span className="small d-block mt-3 mb-4">
              ReaderFeeder delivers articles from your favorite RSS feeds
              to your Kindle Paperwhite, wirelessly, in full-text format,
              so you can read them anywhere, even in the sun,
              thanks to Kindle&rsquo;s E-Ink screen!
              </span>
              <a className="btn btn-lg btn-primary btn-lg-cta" href="/signup">Try it free</a>
            </h2>
          </div>
          <div className="col">
            <img src="/assets/images/hero.svg" alt="" className="hero__img" />
          </div>
        </div>
      </div>
    </div>

    <div className="section features">
      <div className="container">
        <h2 id="features" className="text-serif text-center mb-0">Features</h2>
        <p className="mb-5 mb-lg-7 text-muted text-center">So, why ReaderFeeder is awesome?</p>
        <div className="row">
          <div className="col-md-6 col-lg-5 offset-lg-1">
            <img src="/assets/images/brain.svg" alt="" width="64" />
            <h3 className="h6 mt-4 mb-3">Distraction-free reading</h3>
            <p>
              With Kindle, it&#39;s easy to concentrate on the reading, not on the countless
              notifications, ads and other bells and whistles you are getting every second
              on your phone, tablet or laptop.
            </p>
          </div>
          <div className="col-md-6 col-lg-5">
            <img src="/assets/images/hand.svg" alt="" width="64" />
            <h3 className="h6 mt-4 mb-3">Helps your eyes relax</h3>
            <p>
              Spend entire days in front of your PC screen?
              Then you should definitely consider making ReaderFeeder your default RSS
              reader. Many people say EInk screens are much less stressful to the eye than
              displays of any other type.
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 col-lg-5 offset-lg-1">
            <img src="/assets/images/fulltext.svg" alt="" width="64" />
            <h3 className="h6 mt-4 mb-3">Full-text content</h3>
            <p>
              There are feeds that only provide summary posts with a link to the full
              one. That would force you to use the web browser on Kindle,
              which as you know is turtle slow. ReaderFeeder eliminates that problem
              by extracting the full posts from any URL an RSS feed contains.
            </p>
          </div>
          <div className="col-md-6 col-lg-5">
            <img src="/assets/images/wifi.svg" alt="" width="64" />
            <h3 className="h6 mt-4 mb-3">Wireless delivery</h3>
            <p>
              To receive a set of fresh news and updates from ReaderFeeder, you don&#39;t even need
              to connect your Kindle to computer using a wire. Just make sure its wifi is turned
              On and connected to your local network.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="section mt-5 mt-md-8 pricing">
      <div className="container">
        <h2 id="pricing" className="text-serif text-center mb-5 mb-lg-7">Pricing</h2>

        <p className="text-center">
          <img src="/assets/images/price.png" alt="only $5/mo" className="img-fluid" style={{ marginLeft: '-10px' }} />
        </p>
        <p className="text-center mt-6">
          Our pricing is dead simple: $5 + VAT per month.
          <small className="d-block text-muted">
            No set up costs, no hidden fees.
          </small>
        </p>
        <ul className="list-unstyled text-center mb-6 font-weight-bold" style={{ lineHeight: '1.7' }}>
          <li>Unlimited subscriptions.</li>
          <li>Unlimited personal feeds.</li>
          <li>All features included.</li>
          <li>Email support.</li>
        </ul>

      </div>
    </div>

    <div className="section section-cta text-center mb-6">
      <div className="container">
        <h2 className="text-serif">Get started with ReaderFeeder today</h2>
        <p className="text-center">
          And of course, you can try Readerfeeder for free,
          <br />
          for an unlimited period of time, with a single RSS subscription.
        </p>
        <p className="mt-4">
          <a className="btn btn-lg btn-lg-cta" href="/signup">Try it free</a>
          <br />
          <small className="text-muted">No credit card required</small>
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default HomePage;
