import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import './../../assets/styles/components/login.scss';

export const LoginPage = props => {
  return (
    <section className="Login">
      <div className="Login-wrapper align-self-center">

        <p className="text-center">
          <Link className="Login-logo" to="/"><img src={require("./../../assets/images/logo.png")} alt="" /></Link>
        </p>

        <div className="card card-dialog mx-auto mt-4 Login-dialog">
          <Form className="card-body">

            <h3 className="h5 text-center mt-3">Log in to ReaderFeeder</h3>
            <p className="text-center">Enter your email address and password below.</p>

            <hr className="mt-4"/>

            <FormGroup><Input type="email" name="email" placeholder="Email" /></FormGroup>
            <FormGroup><Input type="password" name="password" placeholder="Password" /></FormGroup>
            <FormGroup check className="mb-4">
              <Label check>
                <Input type="checkbox" />{' '}
                Remember me
              </Label>
            </FormGroup>

            <div className="row m-t-20">
              <div className="col text-right">
                <a href="/app.html" className="btn btn-round btn-primary">LOGIN</a>
              </div>
              <div className="col text-right hidden">
                <button type="button" className="btn btn-circle btn-facebook">
                  <img src={require('./../../assets/images/ico_facebook.png')} alt=""/>
                </button>
                <button type="button" className="btn btn-circle btn-google">
                  <img src={require('./../../assets/images/ico_google.png')} alt=""/>
                </button>
              </div>
            </div>

          </Form>
        </div>

        <p className="mt-4 text-center">
          <Link to="/reset-password" className="">Forgot Password?</Link>
          <br/>
            <strong>Don’t have an account? <Link to="/signup" className="">Register Now</Link></strong>
        </p>

      </div>
    </section>
  );
}
