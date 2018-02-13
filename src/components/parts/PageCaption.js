import React from 'react';

export const PageCaption = ({caption, extra}) => (
  <section className="page-caption u-py-100 u-pt-lg-200 u-pb-lg-150 u-flex-center">
    <div className="container">
      <div className="row">
        <div className="col-12 text-center text-white">
          <h1 className="text-white">{caption}</h1>
          <div className="u-h-4 u-w-50 bg-white rounded mx-auto my-4"></div>
          <p className="lead">{extra}</p>
        </div>
      </div>
    </div>
  </section>
);
