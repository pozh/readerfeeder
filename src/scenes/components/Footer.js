import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem, NavLink } from 'reactstrap';


export const Footer = () => (
  <footer className="Footer">
    <Navbar className="Footer-nav navbar-expand">
      <Container>
        <Link className="navbar-brand" to="/"><img src={require("../../assets/images/logo-footer.png")} alt="" /></Link>
        <Nav navbar className="in">
          <NavItem><NavLink to="/about">About Us</NavLink></NavItem>
          <NavItem><NavLink to="/pricing">Pricing</NavLink></NavItem>
          <NavItem><NavLink to="/terms">Terms of Use</NavLink></NavItem>
          <NavItem><NavLink to="/pricing">Privacy Policy</NavLink></NavItem>
        </Nav>
        <span className="ml-auto text-right">&copy; Copyright 2018 ReaderFeeder</span>
      </Container>
    </Navbar>
  </footer>
);

export default Footer;
