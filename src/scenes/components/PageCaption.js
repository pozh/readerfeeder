import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

export const PageCaption = props => {
  return (
    <section className="PageHeader">
      <Container>
        <Row>
          <Col>
            <h1 className="h3 my-0">{props.children}</h1>
          </Col>
          {/*<Col className="pt-1 text-right">*/}
          {/*<Link className="btn btn-outline-primary btn-round" to="/new-list.html">New List</Link>*/}
          {/*</Col>*/}
        </Row>
      </Container>
    </section>
  );
};
