import React, {Component} from 'react';
import PageCaption from './../../components/PageCaption';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        <PageCaption>Settings</PageCaption>
        <div className="container">
          <div className="row"><div className="col-md-8 offset-md-2">
            <form method="post" action="" id="settingsform">
              <div className="form-group">
                <label>Your Name</label>
                <input className="form-control" id="displayname" name="displayname" type="text" value="Sergey Pozhilov"/>
              </div>
              <div className="form-group">
                <label>Your Kindle's Email Address <sup>*</sup></label>
                <div className="input-group">
                  <input name="kindle_email" className="form-control" type="text" value=""/>
                </div>
              </div>
              <div className="form-group text-right">
                <input type="submit" className="btn btn-primary" name="savesettings" value="Save settings"/>
              </div>
            </form>
          </div></div>
        </div>
      </main>
    );
  }
}

export default Settings;
