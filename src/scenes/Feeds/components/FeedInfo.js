import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'reactstrap';
import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import PageCaption from './../../components/PageCaption';
import { isEmpty } from '../../../utils/commonUtil';

import { TITLE_SUFFIX } from '../../../constants/common';


class FeedInfo extends Component {
  componentWillMount() {
    const feed = this.props.feed;
    const slug = this.props.match.params.slug;

    if (isEmpty(feed) || feed.slug !== slug) {
      this.props.actions.fetchBySlug('feed', slug);
    }
  }

  render() {
    const items = [];
    const feed = this.props.feed;
    const pageTitle = `${feed.title} - Kindle subscription${TITLE_SUFFIX}`;
    // const items = this.state.items;

    if (!feed || this.props.match.params.slug !== feed.slug) {
      return (
        <main>
          <PageCaption>...</PageCaption>
          <Container className="mt-5" />
        </main>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
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
                    {feed.sources && feed.sources.map(source =>
                      <li key={source.url}>{source.url}</li>)}
                  </ul>
                </div>
                {/* <FeedToc toc={items} /> */}
              </Col>
              <Col sm="3">
                <p><Link to="#" className="btn btn-lg btn-block btn-primary">Subscribe</Link></p>
              </Col>
            </Row>
          </Container>
        </main>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  return {
    feed: state.crud.selectedItem.feed,
    apiState: state.api
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, crudAction, apiAction), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedInfo);
