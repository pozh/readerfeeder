import React from 'react';
import FeedInput from './FeedInput';
import { Link } from 'react-router-dom';

const FeedEditor = () => (
  <div>
    <div className="panel-body">
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <h5><strong>Title</strong></h5>
            <input className="form-control" id="form_title" type="text"/>
          </div>
          <h5 className="mt-3"><strong>Feeds</strong> (URL/Count)</h5>
          <FeedInput/>
          <FeedInput/>
          <FeedInput/>
          <FeedInput/>
          <Link className="btn mt-2 btn-secondary" to="">Add Feed</Link>
        </div>

        <div className="col">
          <h5><strong>Schedule</strong></h5>
          <div className="form-group">
            <select className="form-control" name="schedule_period" id="schedule_period"><option value="daily" selected="selected">Send daily</option><option value="weekly">Send weekly</option><option value="monthly">Send monthly</option></select>
          </div>
          <div className="form-group">
            <select className="form-control" name="schedule_day"><option value="0" selected="selected">Sunday</option><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option></select>
          </div>

          <h5 className="mt-4"><strong>Options</strong></h5>
          <div className="form-group">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="keep_images" name="keep_images"/>
              <label className="form-check-label" for="keep_images">Keep images</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="send_as_book" name="send_as_book"/>
              <label className="form-check-label" for="send_as_book">Send as book</label>
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <div className="text-right">
        <a id="add_cancel" className="btn btn-link" href="javascript:;">Cancel</a>
        <input type="submit" className="btn btn-primary" name="add_periodical" value="Submit"/>
      </div>
    </div>
  </div>
);

export default FeedEditor;
