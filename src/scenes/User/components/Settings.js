import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PageCaption from './../../components/PageCaption';
import {isEmpty} from "../../../utils/commonUtil";
import Input from 'arui-feather/input';
import EmailInput from 'arui-feather/email-input';

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
    const user = this.props.user;
    return (
      <main>
        <PageCaption>Settings</PageCaption>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form method="post" action="" id="settingsform">
                <div className="form-group">
                  <Input label='Username' width='available' id="displayname" name="displayname"
                         value={user.first_name}/>
                </div>
                <div className="form-group">
                  <EmailInput label="Kindle e-mail" name="kindle_email" placeholder="Your Kindle's e-mail"
                              width='available'/>
                </div>
                <div className="form-group">
                  <Input label='New password' name="password" type="password" width='available'/>
                </div>
                <div className="form-group">
                  <Input label='Retype password' name="password_copy" type="password" width='available'/>
                </div>
                <div className="form-group text-center">
                  <br/>
                  <button className='btn btn-lg btn-primary'>Save settings</button>
                </div>
              </form>
            </div>
          </div>
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
