import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ReactTable from "react-table";

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

class UserList extends Component {
  static defaultProps = {};
  static propTypes = {};

  componentDidMount() {
    this.props.actions.fetchAll('user');
  }

  render() {
    const users = this.props.users || [];
    const columns = [{
      Header: 'ID',
      accessor: 'id'
    },{
      Header: 'Name',
      accessor: 'first_name'
    },{
      Header: 'Plan',
      accessor: 'plan'
    },{
      Header: 'Email',
      accessor: 'email'
    },{
      Header: 'Settings',
      accessor: 'settings'
    }];

    if (!users.length > 0) return (<p>No users</p>);
    else return (
      <div>
        <h2>Users ({users.length})</h2>
        <ReactTable data={users} columns={columns} pageSize={5} sorted={[{id:'id', desc:true}]}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.crud.items.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
