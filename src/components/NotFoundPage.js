import React from 'react';
import { Link } from 'react-router-dom';
import {Header} from 'components/parts/Header';
import {Footer} from 'components/parts/Footer';

export const NotFoundPage = props => (
  <div>
    <Header/>
    <section className="u-h-100vh u-flex-center">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1 className="u-fs-60 u-fs-md-150 ">404</h1>
            <h2 className="mb-4">Sorry! Page Not Found</h2>
            <p>The link you have followed is broken, or the page has been removed.</p>
            <Link to="/" className="btn btn-rounded btn-primary mt-5">Return to Home</Link>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
  </div>
);
