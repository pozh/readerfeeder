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
    this.addClassName = props.className;
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
      <Navbar className={"Nav "+this.addClassName} color="faded" light expand="lg">
        <Container>
          <Link className="navbar-brand" to="/"><img src={require("../assets/images/logo.png")} alt="" /></Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="btn btn-link" to="/login/">Log In</Link>
              </NavItem>
              <NavItem>
                <Link className="btn btn-round btn-primary" to="/signup/">Sign Up</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}


export const PageCaption = props => {
  return (
    <section className="PageHeader">
      <Container>
        <Row>
          <Col>
            <h1 className="h3 my-0">{props.children}</h1>
          </Col>
          {/*<Col className="pt-1 text-right">*/}
            {/*<Link className="btn btn-outline-primary btn-round" to="/new-list.html">New List</Link>*/}
          {/*</Col>*/}
        </Row>
      </Container>
    </section>
  );
};


// TODO: rewrite ir remove Gravater component
export const Gravatar = props => {
  const { hash, size } = props;
  const imgSrc = `http://1.gravatar.com/avatar/${hash}?s=${size}`;

  return (
    <div className={props.className}>
      <img alt="" src={imgSrc} className="avatar" height={size} width={size} />
    </div>
  );
};


export const Footer = () => (
  <footer className="Footer">
    <Navbar className="Footer-nav navbar-expand">
      <Container>
        <Link className="navbar-brand" to="/"><img src={require("../assets/images/logo-footer.png")} alt="" /></Link>
        <Nav navbar className="in">
          <NavItem><Link className="nav-link" to="/about">About Us</Link></NavItem>
          <NavItem><Link className="nav-link" to="/pricing">Pricing</Link></NavItem>
          <NavItem><Link className="nav-link" to="/terms">Terms of Use</Link></NavItem>
          <NavItem><Link className="nav-link" to="/pricing">Privacy Policy</Link></NavItem>
        </Nav>
        <span className="ml-auto text-right">&copy; Copyright 2018 ReaderFeeder</span>
      </Container>
    </Navbar>
  </footer>
);
