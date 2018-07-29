import React from 'react';
import { Link } from "react-router-dom";

export const Hero = props => (
  <section className="Hero bg-light">
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <h1 className="Hero-heading">RSS Delivery Service for KINDLE</h1>
          <h4 className="Hero-subheading">
            ReaderFeeder delivers RSS feeds in full-text format to your
            Kindle e-reader, wirelessly, on schedule.
          </h4>
          <div className="Hero-actions">
            <Link className="btn btn-lg btn-round btn-primary" to="/feeds">Browse Feeds</Link>
          </div>
        </div>
        <div className="col-md-5">
          <img src={require("assets/images/news.png")} alt="" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
