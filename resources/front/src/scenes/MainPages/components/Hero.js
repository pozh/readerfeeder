import React from 'react';

function Hero() {
  return (
    <div className="section" style={{ overflowX: 'hidden' }}>
      <div className="container d-flex align-content-center hero">
        <div className="row align-content-center">
          <div className="col-lg-6">
            <h1 className="hero__title">
              Read your favorite RSS feeds offline, in the sun!
              <span className="d-block d-lg-none">
                <img width="65%" src={require('assets/images/hero.svg')} alt="" className="mt-3" />
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
            <img src={require('assets/images/hero.svg')} alt="" className="hero__img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
