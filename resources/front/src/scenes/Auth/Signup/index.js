import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import * as authAction from 'actions/authAction';
import SocialAuth from '../components/SocialAuth';

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

  processForm(event) {
    event.preventDefault();
    this.props.actions.signup(this.state.user);
  }

  componentWillMount() {
    document.getElementById('body').className = 'BodySignup';
  }

  componentWillUnmount() {
    const elems = document.querySelectorAll('.BodySignup');
    [].forEach.call(elems, (el) => {
      el.classList.remove('BodySignup');
    });
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    if (this.props.isAuthenticated) return <Redirect to="/" />;
    return (
      <DocumentTitle title="Signup - ReaderFeeder">
        <section className="Signup">
          <div className="Signup-dialog">
            <form className="Signup-form" onSubmit={this.processForm}>

              <Link className="Signup-logo" to="/">
                <img
                  src={require('assets/images/logo.png')}
                  alt=""
                />
              </Link>
              <p className="Signup-greeting">Create Account</p>
              <p className="Signup-cta">Sign up here to start using ReaderFeeder.</p>

              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  onChange={(val) => {
                    this.state.user.first_name = val;
                  }}
                  autoComplete="on"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  onChange={(val) => {
                    this.state.user.email = val;
                  }}
                  autoComplete="on"
                />
              </div>
              <div className="form-group">
                <Input
                  required
                  type="password"
                  width="available"
                  onChange={(val) => {
                    this.state.user.password = val;
                  }}
                  label="Password"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <Input
                  required
                  type="password"
                  width="available"
                  onChange={(val) => {
                    this.state.user.password_confirmation = val;
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
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
