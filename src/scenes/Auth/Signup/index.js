import React, { Component, PropTypes } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import {USER_HOME} from 'constants/common';

import * as flashMessage from 'actions/flashMessage';
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
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();
    this.props.actions.signup(this.state.user);
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  }

  componentWillMount(){
    document.getElementById('body').className='BodySignup';
  }

  componentWillUnmount(){
    let elems = document.querySelectorAll(".BodySignup");
    [].forEach.call(elems, (el) => { el.classList.remove("BodySignup"); });
  }

  render () {
    if (this.state.redirect) return <Redirect to={this.state.redirect}/>;
    else if (this.props.isAuthenticated) return <Redirect to={USER_HOME} />;
    else return (
      <section className="Signup">
        <div className="Signup-dialog">
          <Form className="Signup-form" onSubmit={this.processForm}>

            <Link className="Signup-logo" to="/"><img src={require("assets/images/logo.png")} alt=""/></Link>
            <p className="Signup-greeting">Create Account</p>
            <p className="Signup-cta">Sign up here to start using ReaderFeeder.</p>

            <FormGroup><Input type="text" onChange={this.changeUser} name="name" placeholder="Name" autoComplete="on"/></FormGroup>
            <FormGroup><Input type="email" onChange={this.changeUser} name="email" placeholder="Email" autoComplete="on"/></FormGroup>
            <FormGroup><Input type="password" onChange={this.changeUser} name="password" placeholder="Password" autoComplete="off"/></FormGroup>
            <FormGroup><Input type="password" onChange={this.changeUser} name="passwordcopy" placeholder="Password (again)" autoComplete="off"/></FormGroup>

            <div className="m-t-20">
              <button type="submit" className="btn btn-primary">REGISTER</button>
            </div>

            <p className="mt-4">
              Already have an account? <strong><Link to="/login" className="">Login</Link></strong>
            </p>
          </Form>
        </div>
      </section>
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
    actions: bindActionCreators(_.assign({}, authAction, flashMessage), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
