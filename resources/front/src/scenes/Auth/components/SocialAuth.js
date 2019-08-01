import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import * as authAction from 'actions/authAction';
import './styles.scss';

class SocialAuth extends Component {
  constructor(props) {
    super(props);
  }

  responseFacebook(response) {
    console.log(response);
  }

  responseGoogle(response) {
    console.log(response);
  }

  render() {
    const FbIcon = () => (<img src={require('assets/images/ico_facebook.png')} alt="" />);
    return (
      <span className="social-auth">
        <span className="or">or</span>
        <FacebookLogin
          appId="2340051056323088"
          icon={<FbIcon />}
          cssClass="btn btn-circle btn-facebook mr-1"
          textButton=""
          fields="name,email,picture"
          callback={this.responseFacebook}
        />
        <GoogleLogin
          clientId={GOOGLE_APP_ID}
          render={renderProps => (
            <button
              type="button"
              className="btn btn-circle btn-google"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={require('assets/images/ico_google.png')} alt="" />
            </button>
          )}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
      </span>
    );
  }
}

export default SocialAuth;
