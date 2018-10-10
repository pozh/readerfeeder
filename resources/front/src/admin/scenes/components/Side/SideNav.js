import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home as IcoHome,
  Rss as IcoRss,
  Users as IcoUsers,
  Settings as IcoSettings
} from 'react-feather';
import './sidenav.scss';


const SideNav = () => (
  <ul className="side__nav sidenav">
    <li className="sidenav__item  active">
      <Link className="sidenav__link" to="#"><IcoHome /> Dashboard</Link>
    </li>
    <li className="sidenav__item mt-4">
      <Link className="sidenav__link" to="#"><IcoRss /> Feeds</Link>
    </li>
    <li className="sidenav__item">
      <Link className="sidenav__link" to="#"><IcoUsers /> Users</Link>
    </li>
    <li className="sidenav__item">
      <Link className="sidenav__link" to="#"><IcoSettings /> Settings</Link>
    </li>
  </ul>
);

export default SideNav;
