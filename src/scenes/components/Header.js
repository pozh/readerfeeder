import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, NavbarToggler, Nav, NavItem, Collapse } from 'reactstrap';


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
    const isLight = this.props.light;
    return (
      <Navbar className={"Nav " + (isLight && "bg-light")} expand="lg">
        <Container>
          <Link className="navbar-brand" to="/"><img src={require("assets/images/logo.png")} alt="" /></Link>
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

export default Header;
