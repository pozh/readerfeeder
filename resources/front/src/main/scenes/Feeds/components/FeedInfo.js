import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { bindActionCreators } from 'redux';
import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import { isEmpty } from 'utils/commonUtil';
import PageCaption from './../../components/PageCaption';


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
    const pageTitle = `${feed.title} - Kindle subscription - ReaderFeeder`;
    // const items = this.state.items;

    if (!feed || this.props.match.params.slug !== feed.slug) {
      return (
        <main>
          <PageCaption>...</PageCaption>
          <div className="container mt-5">&nbsp;</div>
        </main>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
        <main>
          <PageCaption>{feed.title}</PageCaption>
          <div className="container">
            <div className="row mt-5">
              <div className="col-sm-9">
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
              </div>
              <div className="col-sm-3">
                <p><Link to="#" className="btn btn-lg btn-block btn-primary">Subscribe</Link></p>
              </div>
            </div>
          </div>
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
