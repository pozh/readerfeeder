import React from 'react';
import './styles.scss';

const PageCaption = props => (
  <header className="PageCaption">
    <div className="container">
      <h1 className="PageCaption__h1">{props.children}</h1>
    </div>
  </header>
);

export default PageCaption;
