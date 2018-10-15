import React from 'react';
import PropTypes from 'prop-types';

const FeedIcon = (props) => {
  return (
    <div className="feed-ico">
      { props.ico && <img src={props.ico} alt=""/> }
    </div>
  );
};

FeedIcon.propTypes = {
  ico: PropTypes.string
};

FeedIcon.defaultProps = {
  ico: null
};

export default FeedIcon;
