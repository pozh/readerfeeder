import React from 'react';
import { Link } from 'react-router-dom';

const FeedCard = props => {
  const feed = props.feed;
  return (
    <div className="Feed">
      <Link to={ "/feed/" + feed.slug } className="Feed-name">
        {props.idx && (<span className="Feed-order">{props.idx}. </span>)}
        { feed.title }
      </Link>
      <div className="Feed-delivery">Delivery: {feed.period}</div>
      <div className="Feed-actions">
        <a href="#" className="Feed-action">Send last issue</a>
        <a href="#" className="Feed-action">Subscribe</a>
      </div>
    </div>
  );
};

export default FeedCard;
