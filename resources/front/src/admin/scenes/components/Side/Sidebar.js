import React from 'react';
import './sidebar.scss';

const Sidebar = props => (
  <div className="side">
    <img src={require("assets/images/logo.png")} alt="" />
    {props.children}
  </div>
);

export default Sidebar;
