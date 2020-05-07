import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _assign from 'lodash/assign';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import * as authAction from 'actions/authAction';
import { NotificationManager as notify } from 'react-notifications';
import * as message from 'constants/message';


import './styles.scss';

class SocialAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleDisabled: false,
      facebookDisabled: true,
    };

    this.responseGoogle = this.responseGoogle.bind(this);
  }

  responseFacebook(response) {
    console.log(response);
  }

  responseGoogle(response) {
    const { actions } = this.props;
    actions.loginSocial({ provider: 'google', data: response });
  }

  render() {
    const FbIcon = () => (<img src={require('assets/images/ico_facebook.png')} alt="" />);
    const { facebookDisabled, googleDisabled } = this.state;
    return (
      <span className="social-auth">
        <span className="or">or</span>
        <FacebookLogin
          appId={FACEBOOK_APP_ID}
          disabled={facebookDisabled}
          icon={<FbIcon />}
          cssClass="btn btn-circle btn-facebook mr-1"
          textButton=""
          fields="name,email,picture"
          callback={this.responseFacebook}
        />
        <GoogleLogin
          clientId={GOOGLE_APP_ID}
          disabled={googleDisabled}
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
          onFailure={() => {
            this.setState({ googleDisabled: true });
            notify.error(message.SOCIAL_AUTH_ERROR);
          }}
        />
      </span>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, authAction), dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SocialAuth);
