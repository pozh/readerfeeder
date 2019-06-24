import React from 'react';
import { Link } from 'react-router-dom';
import h from 'utils/history';

const SortCtrl = () => {

  let order = 'categories';
  if (h.location.pathname === '/feeds/popular') order = 'popular';
  else if (h.location.pathname === '/feeds/recent') order = 'recent';

  return (
    <ul className="Feeds-order">
      <li><Link className={order==='categories' ? 'active' : ''} to="/feeds">Categories</Link></li>
      <li><Link className={order==='popular' ? 'active' : ''} to="/feeds/popular">Most popular</Link></li>
      <li><Link className={order==='recent' ? 'active' : ''} to="/feeds/recent">Recent</Link></li>
    </ul>
  );
};

export default SortCtrl;
