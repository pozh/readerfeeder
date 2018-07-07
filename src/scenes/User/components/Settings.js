import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PageCaption from './../../components/PageCaption';
import {isEmpty} from "../../../utils/commonUtil";

import * as apiAction from 'actions/apiAction';
import * as authAction from 'actions/authAction';


class Settings extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.isAuthenticated && isEmpty(this.props.user)) {
      this.props.actions.setUser();
    }
  }

  render() {
    const user=this.props.user;
    return (
      <main>
        <PageCaption>Settings</PageCaption>
        <div className="container">
          <div className="row"><div className="col-md-8 offset-md-2">
            <form method="post" action="" id="settingsform">
              <div className="form-group">
                <label>Username</label>
                <input className="form-control" id="displayname" name="displayname" type="text" value={user.first_name}/>
              </div>
              <div className="form-group">
                <label>Your Kindle's Email Address <sup>*</sup></label>
                <div className="input-group">
                  <input name="kindle_email" className="form-control" type="text" value=""/>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-6 form-group">
                  <label for="inputPassword">New Password</label>
                  <input name="password" type="password" id="inputPassword" className="form-control" placeholder=""/>
                </div>
                <div className="col-md-6 form-group">
                  <label for="inputPasswordCopy">Retype Password</label>
                  <input name="password_copy" type="password" id="inputPasswordCopy" className="form-control" placeholder=""/>
                </div>
              </div>
              <div className="form-group text-center">
                <br/>
                <input type="submit" className="btn btn-lg btn-primary" name="savesettings" value="Save settings"/>
              </div>
            </form>
          </div></div>
        </div>
      </main>
    );
  }
}



/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    user: state.auth.user,
    apiState: state.api
  }
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction, apiAction), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
