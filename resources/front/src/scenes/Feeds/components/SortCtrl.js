import React from 'react';
import { Link } from 'react-router-dom';
import h from '../../../history';
import * as c from 'constants/common';

const SortCtrl = props => {

  let order = c.ORDER_CATEGORIES;
  if (h.location.pathname == '/feeds/popular') order = c.ORDER_POPULAR;
  else if (h.location.pathname == '/feeds/recent') order = c.ORDER_RECENT;

  return (
    <ul className="Feeds-order">
      <li><Link className={order===c.ORDER_CATEGORIES ? 'active' : ''} to="/feeds">Categories</Link></li>
      <li><Link className={order===c.ORDER_POPULAR ? 'active' : ''} to="/feeds/popular">Most popular</Link></li>
      <li><Link className={order===c.ORDER_RECENT ? 'active' : ''} to="/feeds/recent">Recent</Link></li>
    </ul>
  );
}

export default SortCtrl;
