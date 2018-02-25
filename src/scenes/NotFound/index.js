import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './../components/Footer';
import { Header } from './../components/Header';
import { PageCaption } from './../components/PageCaption';
import { Container } from 'reactstrap';


export const NotFoundPage = props => (
  <div>
    <Header className="white" />
    <PageCaption caption="404. Not Found" extra="" />

    <Container className="pt-5">
      <h2 className="mt-4 mb-4">Sorry! The link you followed here is no longer working.</h2>
      <p>Most likely, the page has been removed or never existed.</p>
      <Link to="/" className="btn btn-round btn-primary mt-5">Return to Home</Link>
    </Container>

    <Footer/>
  </div>
);

export default NotFoundPage;
