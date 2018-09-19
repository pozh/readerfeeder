import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

class FeedList extends Component {
  static defaultProps = {};
  static propTypes = {};

  componentDidMount() {
    this.props.actions.fetchAll('feed');
  }

  render() {
    const feeds = this.props.feeds || [];
    if (!feeds.length > 0) return (<p>No feeds</p>);
    else return (
      <div>
        <h2>Feeds ({feeds.length})</h2>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Active</th>
            <th scope="col">Period</th>
            <th scope="col">Subscribers</th>
            <th scope="col">Time</th>
            <th scope="col">Category</th>
            <th scope="col">Created</th>
            <th scope="col">Sent</th>
          </tr>
          </thead>
          <tbody>
          {feeds.map(feed => (
            <tr key={feed.id}>
              <td>{feed.id}</td>
              <td>{feed.title}</td>
              <td>{feed.status}</td>
              <td>{feed.period}</td>
              <td>{feed.subscribers}</td>
              <td>{feed.schedule_time}</td>
              <td>{feed.category_id}</td>
              <td></td>
              <td></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
    if (!feeds.length > 0) return (<p>No feeds</p>);
  }
}

function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
