import React from 'react';
import { Link } from 'react-router-dom';
import 'assets/styles/hero.scss';

function Hero() {
  return (
    <div className="section my-4" style={{ overflowX: 'hidden' }}>
      <div className="container d-flex align-content-center hero">
        <div className="row align-content-center">
          <div className="col-lg-6">

            <h1 className="hero__title">
              Read RSS feeds offline, on eInk Kindle!
              <span className="d-block d-lg-none">
                <img width="65%" src={require('assets/images/hero.svg')} alt="" className="mt-3" />
              </span>
            </h1>

            <h2 className="h5 font-weight-bold pr-xl-8">
              We deliver full-text content from blogs, websites &amp; news portals
              to Kindle Paperwhite, Touch and Oasis, wirelessly, on schedule!
            </h2>
            <p className="mt-4">
              <Link className="btn btn-lg btn-primary btn-lg-cta btn-round" to="/signup">Try it free</Link>
            </p>

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
