import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col,
  Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
  Collapse, Button
} from 'reactstrap';


export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Navbar className="Nav" color="faded" light fixed="true" expand="lg">
        <Container>
          <NavbarBrand href="/"><img src={require("../../assets/images/logo.png")} alt="" /></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="btn btn-link" to="/#/login/">Log In</Link>
              </NavItem>
              <NavItem>
                <Link className="btn btn-round btn-primary" to="/#/signup/">Sign Up</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}


export const Footer = () => (
  <footer className="Footer">
    <Navbar className="Footer-nav" expand="xs">
      <Container>
        <NavbarBrand href="/"><img src={require("../../assets/images/logo-footer.png")} alt="" /></NavbarBrand>
        <Nav navbar>
          <NavItem><NavLink href="/about">About Us</NavLink></NavItem>
          <NavItem><NavLink href="/pricing">Pricing</NavLink></NavItem>
          <NavItem><NavLink href="/terms">Terms of Use</NavLink></NavItem>
          <NavItem><NavLink href="/pricing">Privacy Policy</NavLink></NavItem>
        </Nav>
        <span className="ml-auto text-right">&copy; Copyright 2018 ReaderFeeder</span>
      </Container>
    </Navbar>
  </footer>
);
