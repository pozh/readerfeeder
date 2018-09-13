import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';


export default function (ComponentToShow) {

  class Authenticate extends Component {

    constructor(props) {
      super(props);
      this.state = {
        redirect: null
      };
    }

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
    };

    componentWillMount() {
      if (!this.props.isAuthenticated && !this.state.redirect) {
        this.setState(() => ({redirect: '/login'}));
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated && !this.state.redirect) {
        this.setState(() => ({redirect: '/login'}));
      }
    }

    render() {
      if (this.state.redirect) return <Redirect to={this.state.redirect} />;
      else return <ComponentToShow {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }

  return connect(mapStateToProps)(Authenticate);
}
