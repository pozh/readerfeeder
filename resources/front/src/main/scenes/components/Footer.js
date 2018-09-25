import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';


const Footer = () => (
  <footer className="Footer">
    <nav className="navbar Footer-nav navbar-expand">
      <div className="container">
        <Link className="navbar-brand" to="/"><img src={require("assets/images/logo-footer.png")} alt="" /></Link>
        <ul className="navbar-nav in">
          <li className="nav-item"><Link className="nav-link" to="/terms">Terms of Use</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/privacy">Privacy Policy</Link></li>
        </ul>
        <span className="ml-auto text-right">ReaderFeeder &copy; {(new Date().getFullYear())}</span>
      </div>
    </nav>
  </footer>
);

export default Footer;
