import React from 'react';
import { Link } from 'react-router-dom';

const TocItem = props => <li><Link to={props.item.url}>{props.item.title}</Link></li>;


const FeedToc = ({toc}) => {
  return (toc &&
    <div>
      <h3>In current issue:</h3>
      <ul>
        {toc.items.map((item, key) => <TocItem item={item} key={key}/>)}
      </ul>
    </div>
  );
};

export default FeedToc;
