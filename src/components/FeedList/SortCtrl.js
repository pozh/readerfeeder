import React from 'react';
import { Link } from 'react-router-dom';

const SortCtrl = props => {
  const order = props.order;
  return (
    <ul className="Feeds-order">
      <li><Link className={order==='categories' ? 'active' : ''} to="/feeds">Categories</Link></li>
      <li><Link className={order==='popular' ? 'active' : ''} to="/feeds/popular">Most popular</Link></li>
      <li><Link className={order==='recent' ? 'active' : ''} to="/feeds/recent">Most recent</Link></li>
      <li><Link className={order==='my' ? 'active' : ''} to="/feeds/my">My Subscriptions</Link></li>
    </ul>
  );
}

export default SortCtrl;
