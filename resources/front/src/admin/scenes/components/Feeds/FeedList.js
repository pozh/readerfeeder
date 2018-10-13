import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import ReactTable from "react-table";

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import Popup from '../Popup/Popup';
import FeedEditor from './FeedEditor';


class FeedList extends Component {
  constructor() {
    super();
    this.state = {
      feedPopup: false
    };

    this.columns = [
      {
        Header: 'ID',
        accessor: 'id',
        className: 'text-center',
        maxWidth: 50,
      }, {
        Header: 'Title',
        accessor: 'title',
        minWidth: 250,
        Cell: (row) => (
          <Link to="#" onClick={this.onEdit}>{ row.value }</Link>
        )
      }, {
        Header: 'Status',
        className: 'text-center',
        accessor: 'status'
      }, {
        Header: 'Period',
        className: 'text-center',
        accessor: 'period'
      }, {
        Header: 'Subscribers',
        className: 'text-center',
        maxWidth: 50,
        accessor: 'subscribers'
      }, {
        Header: 'Delivery time',
        className: 'text-center',
        maxWidth: 50,
        accessor: 'schedule_time'
      }, {
        Header: 'Category',
        accessor: 'category_id'
      }
    ];

    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    if (!this.props.feeds.length > 0) {
      this.props.actions.fetchAll('feed');
      this.props.actions.fetchAll('category');
    }
  }

  onEdit(event) {
    event.preventDefault();
    alert ('EDIT!');
  }

  render() {
    const feeds = this.props.feeds || [];
    if (!feeds.length > 0) return (<p>...</p>);
    else return (
      <div>
        <div className="card-header">
          <div className="row">
            <h5 className="col pt-2">FEEDS ({feeds.length})</h5>
            <div className="col text-right">
              <Popup title="New Feed">
                <FeedEditor/>
              </Popup>
            </div>
          </div>
        </div>
        <ReactTable data={feeds} columns={this.columns} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    feeds: state.crud.items.feeds,
    categories: state.crud.items.categories
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
