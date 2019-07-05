import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import * as authAction from 'actions/authAction';
import SocialAuth from './components/SocialAuth';

import './styles.scss';

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      redirect: false,
      user: {
        first_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
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
    this.props.actions.signup(this.state.user);
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    if (this.props.isAuthenticated) return <Redirect to="/" />;
    return (
      <DocumentTitle title="Signup - ReaderFeeder">
        <section className="auth">
          <div className="auth-dialog">
            <form className="auth-form" onSubmit={this.processForm}>

              <Link className="auth-logo" to="/">
                <img
                  src={require('assets/images/logo.png')}
                  alt=""
                />
              </Link>
              <p className="mt-4 mb-0 h4 font-weight-normal">Create Account</p>
              <p className="mb-4 small text-muted">Sign up here to start using ReaderFeeder.</p>

              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => {
                    this.state.user.first_name = e.target.value;
                  }}
                  autoComplete="on"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => {
                    this.state.user.email = e.target.value;
                  }}
                  autoComplete="on"
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
                <input
                  className="form-control"
                  type="password"
                  onChange={(e) => {
                    this.state.user.password_confirmation = e.target.value;
                  }}
                  label="Password (again)"
                  autoComplete="off"
                />
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-primary">REGISTER</button>
                <SocialAuth />
              </div>

              <p className="mt-4">
                Already have an account?
                {' '}
                <strong>
                  <Link
                    to="/login"
                    className=""
                  >
                    Login
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
