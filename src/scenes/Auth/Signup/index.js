import React, {Component, PropTypes} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DocumentTitle from 'react-document-title';
import Input from 'arui-feather/input';
import {Form} from 'reactstrap';
import {USER_HOME, TITLE_SIGNUP} from 'constants/common';

import * as authAction from 'actions/authAction';

import './styles.scss';


class SignupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      redirect: false,
      user: {
        name: '',
        email: '',
        password: '',
        passwordcopy: ''
      }
    };

    this.processForm = this.processForm.bind(this);
  }

  processForm(event) {
    event.preventDefault();
    console.log(this.state.user);
    this.props.actions.signup(this.state.user);
  }

  componentWillMount() {
    document.getElementById('body').className = 'BodySignup';
  }

  componentWillUnmount() {
    let elems = document.querySelectorAll(".BodySignup");
    [].forEach.call(elems, (el) => {
      el.classList.remove("BodySignup");
    });
  }

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect}/>;
    else if (this.props.isAuthenticated) return <Redirect to={USER_HOME}/>;
    else return (
        <DocumentTitle title={TITLE_SIGNUP}>
          <section className="Signup">
            <div className="Signup-dialog">
              <Form className="Signup-form" onSubmit={this.processForm}>

                <Link className="Signup-logo" to="/"><img src={require("assets/images/logo.png")} alt=""/></Link>
                <p className="Signup-greeting">Create Account</p>
                <p className="Signup-cta">Sign up here to start using ReaderFeeder.</p>

                <div className="form-group">
                  <Input type="text" width='available' onChange={(val) => {
                    this.state.user.name = val;
                  }} label="Name" autoComplete="on"/></div>
                <div className="form-group">
                  <Input required type="email" width='available' onChange={(val) => {
                    this.state.user.email = val;
                  }} label="Email" autoComplete="on"/></div>
                <div className="form-group">
                  <Input required type="password" width='available' onChange={(val) => {
                    this.state.user.password = val;
                  }} label="Password" autoComplete="off"/></div>
                <div className="form-group">
                  <Input required type="password" width='available' onChange={(val) => {
                    this.state.user.passwordcopy = val;
                  }} label="Password (again)" autoComplete="off"/></div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary">REGISTER</button>
                </div>

                <p className="mt-4">
                  Already have an account? <strong><Link to="/login" className="">Login</Link></strong>
                </p>
              </Form>
            </div>
          </section>
        </DocumentTitle>
      );
  }
}


function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
