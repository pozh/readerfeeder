import React, {Component} from 'react';
import PageCaption from './../../components/PageCaption';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';


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
          {!this.props.subscriptions.length > 0 && (
            <div className="text-center">
              <h3>No subscriptions yet</h3>
              <p>
                <br/>
                <Link className="btn btn-lg btn-round btn-primary" to="/feeds">Browse Feeds</Link>
              </p>
            </div>
          )}
          {this.props.subscriptions.length > 0 && (
            <p>xxx</p>
          )}
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

    subscriptions: state.crud.items.subscriptions,
    apiState: state.api
  }
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
