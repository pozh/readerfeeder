import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import * as apiAction from 'actions/apiAction';
import * as authAction from 'actions/authAction';
import { TITLE_SUFFIX, PRO_PLAN_ID } from '../../../constants/common';

import PageCaption from '../../components/PageCaption';

class Pricing extends Component {
  componentWillMount() {
  }

  render() {
    const isAuthenticated = this.props.isAuthenticated;
    const usermeta = this.props.usermeta;
    const isPro = isAuthenticated && (usermeta.plan === 'pro');

    let freeBtn = <Link to="/signup" className="btn btn-primary">Choose Plan</Link>;
    let proBtn = freeBtn;
    if (isAuthenticated) {
      freeBtn = isPro ? <a href="#!" data-product="530517" className="paddle_button">Choose Plan</a> : <span>Current plan</span>;
      proBtn = isPro ? <span>Current plan</span> : <a href="#!" data-product={PRO_PLAN_ID} className="paddle_button">Choose Plan</a>;
    }

    return (
      <DocumentTitle title={`Pricing ${TITLE_SUFFIX}`}>
        <main>
          <PageCaption>
            Choose your plan
            <small>Use ReaderFeeder for free, or go Pro to unlock all its features</small>
          </PageCaption>

          <div className="section pricing">
            <div className="container">
              <div className="row justify-content-center">

                <div className="col-lg-4">
                  <div className={`pricing-card ${isPro || !isAuthenticated ? 'pricing-card_spec' : ''}`}>
                    <h3 className="pricing-card__header">Free</h3>
                    <h4 className="pricing-card__title">Basic Reader</h4>
                    <ul className="pricing-card__features">
                      <li>Ultimate Features</li>
                      <li>Responsive Ready</li>
                      <li>Visual Composer Included</li>
                      <li>24/7 Support System</li>
                    </ul>
                    {freeBtn}
                  </div>
                </div>

                <div className="col-xs-12 col-lg-4">
                  <div className={`pricing-card ${!isPro || !isAuthenticated ? 'pricing-card_spec' : ''}`}>
                    <h3 className="pricing-card__header">
                      <span className="currency">$</span>7<span className="period">/month</span>
                    </h3>
                    <h4 className="pricing-card__title">Pro Reader</h4>
                    <ul className="pricing-card__features">
                      <li>Ultimate Features</li>
                      <li>Responsive Ready</li>
                      <li>Visual Composer Included</li>
                      <li>24/7 Support System</li>
                    </ul>
                    {proBtn}
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
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    usermeta: state.auth.usermeta,
    apiState: state.api
  };
}


/**
 * Map the actions to props.
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, authAction, apiAction), dispatch)
  };
}

/**
 * Connect the component to the Redux store.
 */
export default connect(mapStateToProps, mapDispatchToProps)(Pricing);

