import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

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
    if (!users.length > 0) return (<p>No users</p>);
    else return (
      <div>
        <h2>Users ({users.length})</h2>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Plan</th>
            <th scope="col">email</th>
            <th scope="col">Settings</th>
          </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>&nbsp;</td>
                <td>{user.email}</td>
                <td>{user.settings}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
