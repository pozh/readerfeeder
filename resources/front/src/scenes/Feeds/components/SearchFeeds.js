import React, {Component} from 'react';

class SearchFeeds extends Component {
  render() {
    return (
      <div>
          <input className="form-control form-control-lg" type="text" placeholder="Start typing to find a feed" />
      </div>
    );
  }
}

export default SearchFeeds;
