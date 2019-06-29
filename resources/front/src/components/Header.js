import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as authAction from 'actions/authAction';

import logoImg from 'assets/images/logo.png';


class Header extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    actions: PropTypes.object,
    usermeta: PropTypes.object,
  };

  static defaultProps: {
    usermeta: {},
    actions: {},
    isAuthenticated: false,
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
    const usermeta = this.props.usermeta;

    return (
      <nav className="Nav navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/"><img src={logoImg} alt="" /></Link>
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
            {this.props.isAuthenticated && (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">{usermeta.plan === 'pro' ? '' : <Link className="btn btn-primary Nav-upgrade-btn" to="/pricing">Upgrade</Link>}</li>
                <li className="nav-item"><Link className="nav-link" to="/feeds">RSS Feeds</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/settings">Settings</Link></li>
                <li className="nav-item"><Link className="nav-link" onClick={this.logout} to="#">Logout</Link></li>
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
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(Header);
