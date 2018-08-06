import React, { Component } from 'react';
import './styles.scss';

class SocialAuth extends Component {

  render() {
    return (
      <span className="social-auth">
        <span className="or">or</span>
        <button type="button" className="btn btn-circle btn-facebook">
          <img src={require('assets/images/ico_facebook.png')} alt="" />
        </button>
        <button type="button" className="btn btn-circle btn-google">
          <img src={require('assets/images/ico_google.png')} alt="" />
        </button>
      </span>
    );
  }
}

export default SocialAuth;
