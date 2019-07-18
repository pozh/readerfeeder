import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _assign from 'lodash/assign';
import * as authAction from 'actions/authAction';
import { Header, PageCaption } from 'components/index';


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
    this.props.actions.updateSettings(this.state.settings);
  }

  render() {
    const { user } = this.props;
    const settings = JSON.parse(user.settings);
    return (
      <div>
        <Header />
        <PageCaption title="Settings" />
        <div className="section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form method="post" id="settingsform" onSubmit={this.processForm}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      id="name"
                      onChange={(val) => {
                        this.state.settings.first_name = val;
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="kindle_email">Kindle Email <sup>*</sup></label>
                    <input
                      type="text"
                      className="form-control"
                      name="kindle_email"
                      id="kindle_email"
                      placeholder="Your Kindle's e-mail"
                      onChange={(val) => {
                        this.state.settings.kindle_email = val;
                      }}
                    />
                  </div>
                  <div className="form-group text-center">
                    <br />
                    <button className="btn btn-lg btn-primary">Save settings</button>
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
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_assign({}, authAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
