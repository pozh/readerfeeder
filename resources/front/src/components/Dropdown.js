import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    event.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <li className={`nav-item dropdown ${this.state.isOpen && 'show'}`}>
        <a onClick={this.toggle} className="nav-link dropdown-toggle" href="#">{this.props.caption}</a>
        <div className={`dropdown-menu ${this.state.isOpen && 'show'}`} aria-labelledby="navbarDropdown">
          {this.props.children}
        </div>
      </li>
    );
  }
}

export default Dropdown;
