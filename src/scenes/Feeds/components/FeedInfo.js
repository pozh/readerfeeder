import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Container, Row, Col} from 'reactstrap';
import PageCaption from './../../components/PageCaption';
import FeedToc from './FeedToc';

import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';
import * as flashMessage from 'actions/flashMessage';


class FeedInfo extends Component {

  componentWillMount() {
    let feed = this.props.feed;
    let slug = this.props.match.params.slug;

    if (!feed.length > 0 && feed.slug !== slug) {
      this.props.actions.fetchBySlug('feed', slug);
    }
  };

  render() {

    const items = [];
    const feed = this.props.feed;
    // const items = this.state.items;

    if (!feed || this.props.apiState.isRequesting)
      return (
        <main>
          <Container className="mt-5"></Container>
        </main>
      );
    else return (
      <main>
        <PageCaption>{feed.title}</PageCaption>
        <Container>
          <Row className="mt-5">
            <Col sm="9">
              {feed.description && (
                <div className="mb-5">{feed.description}</div>
              )}
              <div className="mb-5">
                <h3>Sources:</h3>
                <ul>
                  {feed.sources && feed.sources.map((source, idx) => <li key={idx}>{source.url}</li>)}
                </ul>
              </div>
              {/*<FeedToc toc={items} />*/}
            </Col>
            <Col sm="3">
              <p><Link to="#" className="btn btn-lg btn-block btn-primary">Subscribe</Link></p>
              <p><Link to="#" className="btn btn-lg btn-block btn-secondary">Send current issue</Link></p>
            </Col>
          </Row>
        </Container>
      </main>
    );
  };
}


/**
 * Map the state to props.
 */
function mapStateToProps(state) {
  return {
    feed: state.crud.selectedItem['feed'],
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
export default connect(mapStateToProps, mapDispatchToProps)(FeedInfo);
