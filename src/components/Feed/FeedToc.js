import React from 'react';
import { Link } from 'react-router-dom';

const FeedToc = props => {
  const toc = props.toc;
  return (
    <div>
      {toc ? <h3>Read in current issue:</h3> : ""}
      {toc ? toc.items.map((item, key) => <TocItem item={item} key={key}/>) : <h3>NO TOC</h3>}
    </div>
  );
};

export default FeedToc;

const TocItem = props => {
  const item = props.item;
  return (
    <li><Link to={item.url}>{item.title}</Link></li>
  );
};
