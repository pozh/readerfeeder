import React from 'react';


const TocItem = props => (
  <li>
    <a className="text-dark" target="_blank" rel="noopener noreferrer" href={props.item.url}>{props.item.title}</a>
  </li>
);


const FeedToc = ({ items }) => (
  <ul className="feed-toc">
    {items.map((item, key) => <TocItem item={item} key={key} />)}
    <li>... and more</li>
  </ul>
);

export default FeedToc;
