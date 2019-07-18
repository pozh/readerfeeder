import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';

import * as authAction from 'actions/authAction';
import SocialAuth from './components/SocialAuth';
import './styles.scss';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: '',
        password: '',
      },
    };

    this.processForm = this.processForm.bind(this);
  }

  componentDidMount() {
    document.getElementById('body').className = 'body-auth';
  }

  componentWillUnmount() {
    document.getElementById('body').className = '';
  }

  processForm(event) {
    event.preventDefault();
    this.props.actions.login(this.state.user);
  }

  render() {
    if (this.props.isAuthenticated) return <Redirect to="/" />;
    return (
      <DocumentTitle title="Login to ReaderFeeder">
        <section className="auth">
          <div className="auth-dialog">
            <form className="auth-form" onSubmit={this.processForm} autoComplete="on">

              <Link className="auth-logo" to="/">
                <img src={require('assets/images/logo.png')} alt="" />
              </Link>
              <p className="mt-4 mb-0 h4 font-weight-normal">Welcome back!</p>
              <p className="mb-4 small text-muted">Sign in to continue to ReaderFeeder.</p>

              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email address"
                  onChange={(e) => {
                    this.state.user.email = e.target.value;
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="password"
                  onChange={(e) => {
                    this.state.user.password = e.target.value;
                  }}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">LOGIN</button>
                <SocialAuth />
              </div>
              <p className="mt-4">
                <strong><Link to="/reset-password" className="">Forgot Password?</Link></strong>
                <br />
                Don’t have an account?
                {' '}
                <strong>
                  <Link to="/signup" className="">
                    Sign
                    Up
                  </Link>
                </strong>
              </p>
            </form>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, authAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
