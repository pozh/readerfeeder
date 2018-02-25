import React from 'react';
import { Link } from 'react-router-dom';

const FeedToc = props => {
  const toc = props.toc;
  return (
    <div>
      {

        toc && (
          <div>
            <h3>In current issue:</h3>
            <ul>
              {toc.items.map((item, key) => <TocItem item={item} key={key}/>)}
            </ul>
          </div>
        )
      }
    </div>
  );
}

export default FeedToc;

const TocItem = props => {
  const item = props.item;
  return (
    <li><Link to={item.url}>{item.title}</Link></li>
  );
};
