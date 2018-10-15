import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { bindActionCreators } from 'redux';
import * as apiAction from 'actions/apiAction';
import * as crudAction from 'actions/crudAction';

import { isEmpty } from 'utils/commonUtil';
import Loading from '../components/Loading';
import FeedIcon from './components/FeedIcon';
import FeedToc from './components/FeedToc';


class FeedInfo extends Component {
  componentWillMount() {
    const feed = this.props.feed;
    const slug = this.props.match.params.slug;

    if (isEmpty(feed) || feed.slug !== slug) {
      this.props.actions.fetchBySlug('feed', slug);
    }
  }

  render() {
    const feed = this.props.feed;
    const pageTitle = `${feed.title} - Kindle subscription - ReaderFeeder`;

    if (!feed || this.props.match.params.slug !== feed.slug) {
      return (
        <main>
          <div className="feedinfo__pagetitle">
            <div className="container">
              <FeedIcon/>
              <h1>&nbsp;</h1>
            </div>
          </div>
          <div className="container mt-5">
            <div className="mt-5"><Loading/></div>
          </div>
        </main>
      );
    }
    return (
      <DocumentTitle title={pageTitle}>
        <main>
          <div className="feedinfo__pagetitle">
            <div className="container">
              <FeedIcon/>
              <h1>{feed.title}</h1>
            </div>
          </div>
          <div className="container pt-5">
            <div className="row">
              <div className="col-sm-9 mt-7">
                {feed.description && (
                  <div className="mb-5">{feed.description}</div>
                )}
                <div className="mb-5">
                  <h3>Sources:</h3>
                  <ul>
                    {feed.sources && feed.sources.map(source =>
                      <li key={source.url}><strong><a className="text-dark" href={source.url} target="_blank">{source.url}</a></strong></li>)}
                  </ul>
                </div>
                {feed.items && (
                  <div>
                    <h2 className="mb-4">In this issue:</h2>
                    <FeedToc items={feed.items} />
                  </div>
                )}
              </div>
              <div className="col-sm-3">
                <p><Link to="#" className="btn btn-lg btn-block btn-primary">Subscribe</Link></p>
              </div>
            </div>
          </div>
          <hr className="mt-5"/>
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
