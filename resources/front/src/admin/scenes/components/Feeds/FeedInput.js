import React from 'react';
import { Trash as IcoTrash } from 'react-feather';

const FeedInput = () => (
  <div className="form-row mb-1">
    <div className="col-md-9">
      <input type="text" className="form-control"/>
    </div>
    <div className="col">
      <input type="text" className="form-control"/>
    </div>
    <div className="col">
      <button className="btn btn-sm btn-link" type="button"><IcoTrash/></button>
    </div>
  </div>
);

export default FeedInput;
