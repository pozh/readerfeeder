import React from 'react';
import { Link } from 'react-router-dom';

const SortCtrl = () => (
  <ul className="Feeds-order">
    <li><Link to="#">Categories</Link></li>
    <li><Link to="#">Most popular</Link></li>
    <li><Link to="#">Most recent</Link></li>
    <li><Link to="#">My Subscriptions</Link></li>
  </ul>
);

export default SortCtrl;
