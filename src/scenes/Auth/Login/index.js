import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { NotificationManager as nm, NotificationContainer } from 'react-notifications';
import * as constants from 'constants/api';
import * as Auth from 'utils/Auth';

import './styles.scss';


export default class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        redirect: null
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    event.preventDefault();
    console.log(constants.API_LOGIN);
    axios.post(constants.API_LOGIN, {
      email: this.state.user.email,
      password: this.state.user.password
    })
      .then( res => {
        Auth.setToken(res.data.token);
        this.setState(() => ({redirect: '/feeds'}));
      })
      .catch(error => {
        nm.error('Error! please retry');
      });
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  }

  componentWillMount(){
    document.getElementById('body').className='BodyLogin';
  }

  componentWillUnmount(){
    let elems = document.querySelectorAll(".BodyLogin");
    [].forEach.call(elems, (el) => { el.classList.remove("BodyLogin"); });
  }

  render () {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
    else if (Auth.isAuthenticated()) return <Redirect to='/user'/>;
    else return (
      <section className="Login">
        <div className="Login-dialog">
          <Form className="Login-form" onSubmit={this.processForm} autoComplete="on">

            <Link className="Login-logo" to="/"><img src={require("assets/images/logo.png")} alt=""/></Link>
            <p className="Login-greeting">Welcome back!</p>
            <p className="Login-cta">Sign in to continue to ReaderFeeder.</p>

            <FormGroup><Input type="email" onChange={this.changeUser} name="email" placeholder="Email"/></FormGroup>
            <FormGroup><Input type="password" onChange={this.changeUser} name="password" placeholder="Password" autoComplete="off"/></FormGroup>
            <FormGroup check className="mb-4 hidden">
              <Label check>
                <Input type="checkbox"/>{' '}
                Remember me
              </Label>
            </FormGroup>

            <div className="row m-t-20">
              <div className="col">
                <button type="submit" className="btn btn-primary">LOGIN</button>
              </div>
              <div className="col text-right hidden">
                <button type="button" className="btn btn-circle btn-facebook">
                  <img src={require('assets/images/ico_facebook.png')} alt=""/>
                </button>
                <button type="button" className="btn btn-circle btn-google">
                  <img src={require('assets/images/ico_google.png')} alt=""/>
                </button>
              </div>
            </div>

            <p className="mt-4">
              {/*<strong><Link to="/reset-password" className="">Forgot Password?</Link></strong>*/}
              {/*<br/>*/}
              Don’t have an account? <strong><Link to="/signup" className="">Sign Up</Link></strong>
            </p>
          </Form>
        </div>
        <NotificationContainer/>
      </section>
    );
  }
}
