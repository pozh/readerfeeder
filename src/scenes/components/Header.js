import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Navbar, NavbarToggler, Nav, NavItem, Collapse } from 'reactstrap';
import * as Auth from 'utils/Auth';
import './styles.scss';


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout(event) {
    event.preventDefault();
    Auth.deauthenticate();
    this.forceUpdate();
    // window.location.reload();
  }

  render() {
    const isLight = this.props.light;
    return (
      <Navbar className={"Nav " + (isLight && "bg-light")} expand="lg">
        <Container>
          <Link className="navbar-brand" to="/"><img src={require("assets/images/logo.png")} alt="" /></Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>

            {!Auth.isAuthenticated() && (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link className="btn btn-link" to="/login/">Log In</Link>
                </NavItem>
                <NavItem>
                  <Link className="btn btn-round btn-primary" to="/signup/">Sign Up</Link>
                </NavItem>
              </Nav>
            )}

            {Auth.isAuthenticated() && (
              <Nav className="mr-auto" navbar>
                <NavItem><Link className="nav-link" to="/feeds">Browse Feeds</Link></NavItem>
                <NavItem><Link className="nav-link" to="/subscriptions">My Subscriptions</Link></NavItem>
              </Nav>
            )}

            {Auth.isAuthenticated() && (
              <Nav navbar>
                <NavItem><Link className="nav-link" onClick={this.logout} to="#">Logout</Link></NavItem>
              </Nav>
            )}

          </Collapse>
        </Container>
      </Navbar>
    );
  }
}
