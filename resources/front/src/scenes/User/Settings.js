import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _assign from 'lodash/assign';
import * as authAction from 'actions/authAction';
import TextInput from 'components/ui/TextInput';
import { Header, PageCaption } from 'components/index';


class Settings extends Component {
  constructor(props) {
    super(props);
    const settings = JSON.parse(props.user.settings);
    this.state = {
      settings: {
        id: props.user.id,
        first_name: props.user.first_name,
        kindle_email: settings ? settings.kindle_email : '',
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  handleChange(event) {
    // const { name, value } = event.target;
    // this.setState(prevState => {
    //   const user = { ...prevState.user, [name]: value };
    //   return { ...prevState, user };
    // });
  }

  processForm(event) {
    event.preventDefault();
    this.props.actions.updateSettings(this.state.settings);
  }

  render() {
    const { user } = this.props;
    const settings = JSON.parse(user.settings) || {};
    return (
      <div>
        <Header />
        <PageCaption title="Settings" />
        <div className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form method="post" id="settingsform" onSubmit={this.processForm}>
                  <TextInput
                    label="Your Name"
                    name="fName"
                    required
                    value={user.first_name}
                    onChange={this.handleChange}
                  />
                  <TextInput
                    label="Kindle Email"
                    name="kindle_email"
                    required
                    value={settings.kindle_email}
                    onChange={this.handleChange}
                  />
                  <div className="form-group text-center">
                    <br />
                    <button type="button" className="btn btn-lg btn-primary">Save settings</button>
                  </div>
                  <div className="form-group mt-6 text-center">
                    <p>
                      <strong>Membership: </strong>
                      Free, since March 2019
                    </p>
                    <button type="button" className="btn btn-primary">Upgrade</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.auth.user,
    usermeta: state.auth.usermeta,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, authAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
