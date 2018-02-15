import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import {Header, PageCaption, Footer} from './parts/Layout';
import FeedList from "./parts/FeedList";

import './../assets/styles/components/browse.scss';

export const BrowsePage = props => (
  <div>
    <Header className="white" />
    <PageCaption caption="Subscribe to Feeds" extra="" />

    <section className="Feeds pt-5">
      <Container>
        <ul className="Feeds-order">
          <li><Link className="active" to="#">Categories</Link></li>
          <li><Link to="#">Most popular</Link></li>
          <li><Link to="#">Most recent</Link></li>
          <li><Link className="disabled" to="#">My Subscriptions</Link></li>
        </ul>

        <FeedList/>

      </Container>
    </section>
    <Footer/>
  </div>
);

export default BrowsePage;
