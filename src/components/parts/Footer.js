import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="footer">
    <nav className="navbar navbar-light justify-content-between">
      <div className="container">
        <Link to="/" className="navbar-brand"><img src={require("../../assets/images/logo.png")} alt="" /></Link>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/pricing">Pricing</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/terms">Terms of Use</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/pricing">Privacy Policy</Link></li>
            </ul>
          </div>
        </nav>
        <span className="ml-auto">&copy; Copyright 2017 Readlists.org</span>
      </div>
    </nav>
  </footer>
);

export default Footer;
