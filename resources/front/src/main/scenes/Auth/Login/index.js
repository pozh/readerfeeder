import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import Input from 'arui-feather/input';

import { USER_HOME, TITLE_LOGIN } from 'constants/common';
import * as authAction from 'actions/authAction';
import SocialAuth from "../components/SocialAuth";
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

  processForm(event) {
    event.preventDefault();
    this.props.actions.login(this.state.user);
  }

  componentWillMount() {
    document.getElementById('body').className = 'BodyLogin';
  }

  componentWillUnmount() {
    const elems = document.querySelectorAll('.BodyLogin');
    [].forEach.call(elems, (el) => {
      el.classList.remove('BodyLogin');
    });
  }

  render() {
    if (this.props.isAuthenticated) return <Redirect to={USER_HOME} />;
    else return (
      <DocumentTitle title={TITLE_LOGIN}>
        <section className="Login">
          <div className="Login-dialog">
            <form className="Login-form" onSubmit={this.processForm} autoComplete="on">

              <Link className="Login-logo" to="/"><img src={require('assets/images/logo.png')} alt="" /></Link>
              <p className="Login-greeting">Welcome back!</p>
              <p className="Login-cta">Sign in to continue to ReaderFeeder.</p>

              <div className="form-group">
                <Input
                  onChange={(val) => {
                    this.state.user.email= val;
                  }}
                  label="Email"
                  width="available"
                />
              </div>
              <div className="form-group">
                <Input
                  type="password"
                  onChange={(val) => {
                    this.state.user.password = val;
                  }}
                  label="Password"
                  autoComplete="off"
                  width="available"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">LOGIN</button>
                <SocialAuth/>
              </div>
              <p className="mt-4">
                <strong><Link to="/reset-password" className="">Forgot Password?</Link></strong>
                <br />
                  Don’t have an account? <strong><Link to="/signup" className="">Sign Up</Link></strong>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
