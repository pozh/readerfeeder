import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _assign from 'lodash/assign';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import * as apiAction from 'actions/apiAction';
import * as authAction from 'actions/authAction';

import PageCaption from '../../components/PageCaption';
import ButtonConfirm from '../../components/ButtonConfirm';


class Pricing extends Component {
  constructor(props) {
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleBtnClick(event) {
    event.preventDefault();
    const { isAuthenticated, user, usermeta } = this.props;
    const isPro = isAuthenticated && (usermeta.plan === 'pro');
    if (isPro) {
      // cancell pro plan
    } else {
      Paddle.Checkout.open({
        product: PRO_PLAN_ID,
        email: user.email,
        success: '/pricing#purchase-complete',
        passthrough: user.id
      });
    }
  }

  logout(event) {
    event.preventDefault();
    this.props.actions.logout();
  }

  render() {
    const { isAuthenticated, usermeta, location } = this.props;
    const isPro = isAuthenticated && (usermeta.plan === 'pro');
    let freeBtn;
    let proBtn;
    if (isPro) {
      proBtn = <span>Current plan</span>;
      freeBtn = <ButtonConfirm className="btn btn-primary" href="#" onClick={this.handleBtnClick}>Choose Plan</ButtonConfirm>;
    } else {
      proBtn = <a className="btn btn-primary" href="#" onClick={this.handleBtnClick}>Choose Plan</a>;
      freeBtn = <span>Current plan</span>;
    }

    if (location.hash === '#purchase-complete') {
      return (
        <DocumentTitle title="Pricing - ReaderFeeder">
          <div className="section text-center my-6 py-6">
            <h1>
Purchase complete. Please
              <Link to="#" onClick={this.logout}>relogin</Link>
            </h1>
          </div>
        </DocumentTitle>
      );
    } return (
      <DocumentTitle title="Pricing - ReaderFeeder">
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
                    {!isAuthenticated && <Link to="/signup" className="btn btn-primary">Choose Plan</Link>}
                    {isAuthenticated && freeBtn}
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
                    {!isAuthenticated && <Link to="/signup" className="btn btn-primary">Choose Plan</Link>}
                    {isAuthenticated && proBtn}
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
    actions: bindActionCreators(_assign({}, authAction, apiAction), dispatch)
  };
}

/**
 * Connect the component to the Redux store.
 */
export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
