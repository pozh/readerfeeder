import React, {Component} from 'react';
import PageCaption from './../../components/PageCaption';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import * as flashMessage  from 'actions/flashMessage';


class Subscriptions extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.subscriptions.length > 0) {
      this.props.actions.fetchAll('subscription');
    }
  }

  render() {
    return (
      <main>
        <PageCaption>Subscriptions</PageCaption>
        <Container>
        </Container>
      </main>
    );
  }
}


/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    subscriptions: state.crud.user.subscriptions,
    apiState: state.api,
    message: state.flash.message
  }
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction, flashMessage), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
