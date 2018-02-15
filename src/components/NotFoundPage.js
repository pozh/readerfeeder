import React from 'react';
import { Link } from 'react-router-dom';
import {Header, PageCaption, Footer} from './parts/Layout';
import { Container, Row, Col } from 'reactstrap';


const NotFoundPage = props => (
  <div>
    <Header className="white" />
    <PageCaption caption="Not Found" extra="" />

    <Container className="pt-5">
      <h1>404</h1>
      <h2 className="mb-4">Sorry! Page Not Found</h2>
      <p>The link you have followed is broken, or the page has been removed.</p>
      <Link to="/" className="btn btn-round btn-primary mt-5">Return to Home</Link>
    </Container>

    <Footer/>
  </div>
);

export default NotFoundPage;
