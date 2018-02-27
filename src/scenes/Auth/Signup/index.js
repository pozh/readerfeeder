import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {apiEndPoints as api} from "../../../constants";
import './styles.scss';


export class SignupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      user: {
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

    axios.post(api.signup, {
      email: this.state.user.email,
      password: this.state.user.password
    })
      .then( res => {console.log(res);})
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
    return (
      <section className="Signup">
        <div className="Signup-dialog">
          <Form className="Signup-form" onSubmit={this.processForm} action={api.signup}>

            <Link className="Signup-logo" to="/"><img src={require("assets/images/logo.png")} alt=""/></Link>
            <p className="Signup-greeting">Create Account</p>
            <p className="Signup-cta">Sign up here to start using ReaderFeeder.</p>

            <FormGroup><Input type="email" onChange={this.changeUser} name="email" placeholder="Email"/></FormGroup>
            <FormGroup><Input type="password" onChange={this.changeUser} name="password" placeholder="Password"/></FormGroup>
            <FormGroup><Input type="password" onChange={this.changeUser} name="passwordcopy" placeholder="Password (again)"/></FormGroup>

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

export default SignupPage;
