import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as authAction from 'actions/authAction';

import './header.scss';
import logoImg from 'assets/images/logo.png';


class Header extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    usermeta: PropTypes.shape({
      plan: PropTypes.string.isRequired,
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
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout(event) {
    event.preventDefault();
    this.props.actions.logout();
  }

  render() {
    const { isAuthenticated, usermeta } = this.props;
    const url = window.location.pathname;

    return (
      <nav className="Nav navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/"><img src={logoImg} alt="" /></Link>
          {usermeta.plan === 'pro' ? '' : <Link className="btn btn-primary btn-round mr-auto" to="/pricing">Upgrade</Link>}
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
          <div className={`collapse navbar-collapse ${this.state.isOpen && 'show'}`}>
            {isAuthenticated && (
              <ul className="navbar-nav ml-auto">
                <li className={`nav-item ${url.indexOf('feeds') >= 0 ? 'active':''}`}><Link className="nav-link" to="/feeds">RSS Feeds</Link></li>
                <li className={`nav-item ${url.indexOf('settings') >= 0 ? 'active':''}`}><Link className="nav-link" to="/settings">Settings</Link></li>
                <li className="nav-item"><a href="" className="nav-link" onClick={this.logout}>Logout</a></li>
              </ul>
            )}
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
