import React from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import './styles.scss';


export const SignupPage = props => {
  return (
    <section className="Signup">
      <div className="Signup-wrapper align-self-center">

        <p className="text-center">
          <Link className="Signup-logo" to="/"><img src={require("assets/images/logo.png")} alt="" /></Link>
        </p>

        <div className="card card-dialog mx-auto mt-4 Login-dialog">
          <Form className="card-body">

            <h3 className="h5 text-center mt-3">Create Account</h3>
            <p className="text-center">Enter your email address and password below.</p>

            <hr className="mt-4"/>

            <FormGroup><Input type="email" name="email" placeholder="Email" /></FormGroup>
            <FormGroup><Input type="password" name="password" placeholder="Password" /></FormGroup>
            <FormGroup><Input type="password" name="password2" placeholder="Repeat Password" /></FormGroup>

            <div className="row m-t-20">
              <div className="col text-right">
                <a href="/app.html" className="btn btn-round btn-primary">REGISTER</a>
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

          </Form>
        </div>

        <p className="mt-4 text-center">
            Already have an account? <strong><Link to="/login" className="">Login here</Link></strong>
        </p>

      </div>
    </section>
  );
}
