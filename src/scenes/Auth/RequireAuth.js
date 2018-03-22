import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';


export default function (ComponentToShow) {

  class Authenticate extends Component {

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
    };

    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.context.router.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.context.router.push('/login');
      }
    }

    render() {
      return <ComponentToShow {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }

  return connect(mapStateToProps)(Authenticate);
}
