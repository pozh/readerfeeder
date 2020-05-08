import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as authAction from 'actions/authAction';

import 'assets/styles/header.scss';
import logoImg from 'assets/images/logo.png';


class Header extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    usermeta: PropTypes.shape({
      plan: PropTypes.string,
    }),
  };

  static defaultProps = {
    usermeta: {
      plan: '',
    },
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
  }

  logout(event) {
    const { actions } = this.props;
    event.preventDefault();
    actions.logout();
  }

  render() {
    const { isAuthenticated, usermeta } = this.props;
    const url = window.location.pathname;
    const { state } = this;

    return (
      <nav className="Nav navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/"><img src={logoImg} alt="" /></Link>
          {!isAuthenticated || usermeta.plan === 'pro' ? ''
            : <Link className="btn btn-primary btn-round mr-auto" to="/pricing">Upgrade</Link>}
          <button onClick={this.toggle} className="btn btn-link d-lg-none p-0 ml-3 collapsed" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeMiterlimit="10"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </button>
          <div className={`collapse navbar-collapse ${state.isOpen && 'show'}`}>
            <ul className="navbar-nav ml-auto">
              <li className={`nav-item ${url.length < 2 ? 'active' : ''}`}>
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className={`nav-item ${url.indexOf('browse') >= 0 ? 'active' : ''}`}>
                <Link className="nav-link" to="/browse">RSS Feeds</Link>
              </li>
              {isAuthenticated && (
              <li className={`nav-item ${url.indexOf('settings') >= 0 ? 'active' : ''}`}>
                <Link className="nav-link" to="/settings">Settings</Link>
              </li>
              )}
              {!isAuthenticated && (
                <li className="nav-item">
                  <Link className="btn navbar__btn btn-outline-primary" to="/login">Sign In</Link>
                </li>
              )}
              {isAuthenticated && (
              <li className="nav-item">
                <span className="nav-link" onClick={this.logout}>Logout</span>
              </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}


function stateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    usermeta: state.auth.usermeta,
    user: state.auth.user
  };
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, authAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(Header);
