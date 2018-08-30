import React, { Component } from 'react';
import './styles.scss';

class SocialAuth extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(provider) {
    window.location.assign(`/redirect/${provider}`);
  }

  render() {
    return (
      <span className="social-auth">
        <span className="or">or</span>
        <button onClick={() => { this.handleClick('facebook'); }} type="button" className="btn btn-circle btn-facebook">
          <img src={require('assets/images/ico_facebook.png')} alt="" />
        </button>
        <button onClick={() => { this.handleClick('google'); }} type="button" className="btn btn-circle btn-google">
          <img src={require('assets/images/ico_google.png')} alt="" />
        </button>
      </span>
    );
  }
}

export default SocialAuth;
