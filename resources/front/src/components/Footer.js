import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';


const Footer = () => (
  <footer className="Footer">
    <div className="container">
      <div className="row">
        {/*<div className="col-md-4">*/}
          {/*<Link to="/"><img width="150" src={require("assets/images/logo-footer.png")} alt="" /></Link>*/}
        {/*</div>*/}
        <div className="col text-center">
          <p className="mb-1">ReaderFeeder &copy; {(new Date().getFullYear())}</p>
          <p><Link to="/terms">Terms of Use</Link> &middot; <Link to="/privacy">Privacy Policy</Link></p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
