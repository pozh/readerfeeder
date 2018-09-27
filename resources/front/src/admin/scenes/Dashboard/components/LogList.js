import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactTable from "react-table";

import * as crudAction from 'actions/crudAction';

class LogList extends Component {
  componentDidMount() {
    this.props.actions.fetchAll('log');
  }

  render() {
    const logs = this.props.logs || [];
    const columns = [{
      Header: 'Log',
      accessor: 'log'
    },{
      Header: 'Description',
      accessor: 'description'
    }];

    if (!logs.length > 0) return (<p>No logs</p>);
    else return (
      <div className="card">
        <div className="card-header">
          <div className="row">
            <h5 className="col pt-2">Logs <span className="badge badge-pill badge-primary">{logs.length}</span></h5>
          </div>
        </div>
        <div className="card-body">
          <ReactTable data={logs} columns={columns} pageSize={20} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logs: state.crud.items.logs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogList);
