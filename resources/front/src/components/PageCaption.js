import React from 'react';

const PageCaption = props => (
  <header className="PageCaption pb-5">
    <div className="container">
      <h1 className="text-center mt-6 text-serif">
        {props.title}
        {props.caption &&
        <small className="d-block h6 text-muted font-weight-normal">
          {props.caption}
        </small>
        }
      </h1>
      {props.children}
    </div>
  </header>
);

export default PageCaption;
