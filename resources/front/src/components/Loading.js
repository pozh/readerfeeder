import React from 'react';

const loader = require('assets/images/loading.svg');

export default (props) => (
  <div className="text-center mt-8 mb-8">
    <img src={loader} alt="" />
    <p v-if="props.message" className="mt-3">{ props.message }</p>
  </div>
);
