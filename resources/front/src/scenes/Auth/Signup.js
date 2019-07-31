import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import * as authAction from 'actions/authAction';
import TextInput from 'components/ui/TextInput';
import SocialAuth from './components/SocialAuth';

import './styles.scss';

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      user: {
        fName: '',
        email: '',
        password: '',
        passwordCopy: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      const user = { ...prevState.user, [name]: value };
      return { ...prevState, user };
    });
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

              <TextInput
                label="First Name"
                name="fName"
                onChange={this.handleChange}
              />
              <TextInput
                label="Email"
                name="email"
                onChange={this.handleChange}
              />
              <TextInput
                label="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
              />
              <TextInput
                label="Password (again)"
                type="password"
                name="passwordCopy"
                onChange={this.handleChange}
              />

              <div className="mt-4">
                <button type="submit" className="btn btn-primary">REGISTER</button>
                <SocialAuth />
              </div>

              <p className="mt-4">
                Already have an account?
                {' '}
                <Link to="/login" className="font-weight-bold">Login</Link>
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
