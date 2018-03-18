import React, { Component, PropTypes } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { appConstants as constants } from '../../../constants/api';
import * as Auth from 'utils/Auth';
import './styles.scss';


export default class SignupPage extends Component {

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

    if (!this.state.user.password) {
      NotificationManager.error('No password provided!');
      return;
    }
    if (this.state.user.password !== this.state.user.passwordcopy) {
      NotificationManager.error('Passwords do not match!');
      return;
    }

    axios.post(constants.API_SIGNUP, {
      name: this.state.user.name,
      email: this.state.user.email,
      password: this.state.user.password
    })
      .then( res => {
        Auth.authenticate(res.data.token);
        this.setState({redirect: true});
      })
      .catch(error => {
        NotificationManager.error('Error! please try with another email');
        console.log(error);
      });
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
    if (this.state.redirect) return <Redirect to='/feeds'/>;
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
        <NotificationContainer/>
      </section>
    );
  }

}
