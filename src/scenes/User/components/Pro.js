import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PageCaption from './../../components/PageCaption';
import DocumentTitle from 'react-document-title';

import * as apiAction from 'actions/apiAction';
import * as authAction from 'actions/authAction';
import {TITLE_PRICING} from "constants/common";


class Pro extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // if (this.props.isAuthenticated && isEmpty(this.props.user)) {
    //   this.props.actions.readUser();
    // }
  }

  render() {
    const user = this.props.user;
    return (
      <DocumentTitle title={TITLE_PRICING}>
        <main>
          <PageCaption>
            Choose your plan
            <small>Find the plan that suits your needs</small>
          </PageCaption>

          <div className="section pricing">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4">
                  <div className="pricing-card">
                    <h3 className="pricing-card__header">Free</h3>
                    <h4 className="pricing-card__title">Basic Reader</h4>
                      <ul className="pricing-card__features">
                        <li>Ultimate Features</li>
                        <li>Responsive Ready</li>
                        <li>Visual Composer Included</li>
                        <li>24/7 Support System</li>
                      </ul>
                      <a href="#" className="btn btn-secondary">Choose Plan</a>
                  </div>
                </div>
                <div className="col-xs-12 col-lg-4">
                  <div className="pricing-card">
                    <h3 className="pricing-card__header">
                      <span className="currency">$</span>9<span className="period">/month</span>
                    </h3>
                      <h4 className="pricing-card__title">Power Reader</h4>
                      <ul className="pricing-card__features">
                        <li>Ultimate Features</li>
                        <li>Responsive Ready</li>
                        <li>Visual Composer Included</li>
                        <li>24/7 Support System</li>
                      </ul>
                      <a href="#" className="btn btn-secondary">Choose Plan</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </DocumentTitle>
    );
  }
}


/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    user: state.auth.user,
    apiState: state.api
  }
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction, apiAction), dispatch)
  }
}

/**
 * Connect the component to the Redux store.
 */

export default connect(mapStateToProps, mapDispatchToProps)(Pro);




