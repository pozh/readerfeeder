import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {Container, Navbar, NavbarToggler, Nav, NavItem, Collapse} from 'reactstrap';
import * as authAction from 'actions/authAction';

import './styles.scss';


class Header extends React.Component {
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
    this.props.actions.logout();
  }

  render() {
    const isLight = this.props.light;
    return (
      <Navbar className={"Nav " + (isLight && "bg-light")} expand="lg">
        <Container>
          <Link className="navbar-brand" to="/"><img src={require("assets/images/logo.png")} alt=""/></Link>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            {!this.props.isAuthenticated && (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link className="btn btn-link" to="/login/">Log In</Link>
                </NavItem>
                <NavItem>
                  <Link className="btn btn-round btn-primary" to="/signup/">Sign Up</Link>
                </NavItem>
              </Nav>
            )}

            {this.props.isAuthenticated && (
              <Nav className="mr-auto" navbar>
                <NavItem><Link className="nav-link" to="/feeds">Browse Feeds</Link></NavItem>
                <NavItem><Link className="nav-link" to="/subscriptions">My Subscriptions</Link></NavItem>
              </Nav>
            )}

            {this.props.isAuthenticated && (
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


function stateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Header)

