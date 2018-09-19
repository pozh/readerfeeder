import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactTable from "react-table";

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

class FeedList extends Component {
  static defaultProps = {};
  static propTypes = {};

  componentDidMount() {
    this.props.actions.fetchAll('feed');
    this.props.actions.fetchAll('category');
  }

  render() {
    const feeds = this.props.feeds || [];
    const columns = [{
      Header: 'ID',
      accessor: 'id'
    }, {
      Header: 'Title',
      accessor: 'title',
    }, {
      Header: 'Status',
      accessor: 'status'
    }, {
      Header: 'Period',
      accessor: 'period'
    }, {
      Header: 'Subscribers',
      accessor: 'subscribers'
    }, {
      Header: 'Delivery time',
      accessor: 'schedule_time'
    }, {
      Header: 'Category',
      accessor: 'category_id'
    }];

    if (!feeds.length > 0) return (<p>...</p>);
    else return (
      <div className={this.props.className}>
        <h2>Feeds ({feeds.length})</h2>
        <ReactTable data={feeds} columns={columns} />
      </div>
    );
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
