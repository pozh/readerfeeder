import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as authAction from 'actions/authAction';
import { isEmpty } from '../../utils/commonUtil';

import './styles.scss';
import logoImg from './../../assets/images/logo.png';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  componentWillMount() {
    if (this.props.isAuthenticated && isEmpty(this.props.user)) {
      this.props.actions.setUser();
    }
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
      <nav className={`Nav navbar navbar-expand-lg navbar-light ${isLight && 'bg-light'}`}>
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
            {!this.props.isAuthenticated && (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="btn btn-link" to="/login/">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/signup/">Sign Up</Link>
                </li>
              </ul>
            )}

            {this.props.isAuthenticated && (
              <ul className="navbar-nav mr-auto">
                <li className="nav-item"><Link className="nav-link" to="/feeds">Browse Feeds</Link></li>
              </ul>
            )}

            {this.props.isAuthenticated && (
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="btn btn-primary Nav-upgrade-btn" to="/pro">Upgrade</Link></li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.user.first_name}
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/subscriptions">Subscriptions</Link>
                    <Link className="dropdown-item" to="/settings">Settings</Link>
                    <div className="dropdown-divider"> </div>
                    <Link className="dropdown-item" onClick={this.logout} to="#">Logout</Link>
                  </div>
                </li>
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
    user: state.auth.user
  };
}

function dispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  };
}

export default connect(stateToProps, dispatchToProps)(Header);
