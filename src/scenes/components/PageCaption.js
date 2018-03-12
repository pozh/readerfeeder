import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import './styles.scss';

export const PageCaption = props => {
  return (
    <header className="PageCaption">
      <Container>
        <h1 className="PageCaption__h1">{props.children}</h1>
      </Container>
    </header>
  );
};

export default PageCaption;
