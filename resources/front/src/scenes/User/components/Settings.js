import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Input from 'arui-feather/input';
import EmailInput from 'arui-feather/email-input';

import * as authAction from '../../../actions/authAction';
import PageCaption from './../../components/PageCaption';


class Settings extends Component {
  constructor(props) {
    super(props);
    const settings = JSON.parse(props.user.settings);
    this.state = {
      errors: {},
      redirect: false,
      settings: {
        id: props.user.id,
        first_name: props.user.first_name,
        kindle_email: settings ? settings.kindle_email : '',
      }
    };

    this.processForm = this.processForm.bind(this);
  }

  processForm(event) {
    event.preventDefault();
    console.log(this.state.settings);
    this.props.actions.updateSettings(this.state.settings);
  }

  render() {
    const user = this.props.user;
    const settings = JSON.parse(user.settings);
    return (
      <main className="border-bottom">
        <PageCaption>Settings</PageCaption>
        <div className="section"><div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form method="post" id="settingsform" onSubmit={this.processForm}>
                <div className="form-group">
                  <Input
                    label="Name"
                    width="available"
                    name="name"
                    onChange={(val) => { this.state.settings.first_name = val; }}
                    defaultValue={this.state.settings.first_name}
                  />
                </div>
                <div className="form-group">
                  <EmailInput
                    label="Kindle e-mail"
                    name="kindle_email"
                    placeholder="Your Kindle's e-mail"
                    width="available"
                    onChange={(val) => { this.state.settings.kindle_email = val; }}
                    defaultValue={settings ? settings.kindle_email : ''}
                  />
                </div>
                <div className="form-group text-center">
                  <br />
                  <button className="btn btn-lg btn-primary">Save settings</button>
                </div>
              </form>
            </div>
          </div>
        </div></div>
      </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.auth.user,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
