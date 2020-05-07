import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _assign from 'lodash/assign';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';

import * as authAction from 'actions/authAction';
import TextInput from 'components/TextInput';
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

    this.handleChange = this.handleChange.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  componentDidMount() {
    document.getElementById('body').className = 'body-auth';
  }

  componentWillUnmount() {
    document.getElementById('body').className = '';
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      const user = { ...prevState.user, [name]: value };
      return { ...prevState, user };
    });
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

              <a className="auth-logo" href="/">
                <img src={require('assets/images/logo.png')} alt="" />
              </a>
              <p className="mt-4 mb-0 h4 font-weight-normal">Welcome back!</p>
              <p className="mb-4 small text-muted">Sign in to continue to ReaderFeeder.</p>

              <TextInput
                label="Email"
                name="email"
                required
                onChange={this.handleChange}
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                required
                onChange={this.handleChange}
              />

              <div className="form-group">
                <button type="submit" className="btn btn-primary">LOGIN</button>
                <SocialAuth />
              </div>
              <p className="mt-4">
                <strong><Link to="/reset-password" className="">Forgot Password?</Link></strong>
                <br />
                Don’t have an account?
                {' '}
                <Link to="/signup" className="font-weight-bold">Sign Up</Link>
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
