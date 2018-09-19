import React, {Component} from 'react';
import PropTypes from 'prop-types';

class UserList extends Component {
  static defaultProps = {};
  static propTypes = {};

  componentDidMount() {
    this.state.users = [];
  }

  state = {
    users: []
  };

  render() {
    if (!this.state.users.count > 0) return (<p>No users</p>);
    else return (
      <div>
        <h2>Users : {this.state.users.count}</h2>
        <table className="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Plan</th>
            <th scope="col">email</th>
            <th scope="col">kindle email</th>
            <th scope="col">Settings</th>
          </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    );
  }
}

export default UserList;
