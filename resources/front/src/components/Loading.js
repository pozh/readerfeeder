import React from 'react';

const loader = require('assets/images/loading.svg');

export default () => (
  <div className="text-center mt-8 mb-8">
    <img src={loader} alt="" />
  </div>
);
