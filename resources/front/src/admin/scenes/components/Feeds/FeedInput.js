import React from 'react';
import { Trash as IcoTrash } from 'react-feather';
import { Field } from 'react-final-form'

const FeedInput = () => (
  <div className="form-row mb-1">
    <div className="col-md-9">
      <Field name="feedUrl" component="input" className="form-control" placeholder="URL" />
    </div>
    <div className="col">
      <Field name="feedCnt" component="input" className="form-control" placeholder="Cnt" />
    </div>
    <div className="col">
      <button className="btn btn-sm btn-link" type="button"><IcoTrash/></button>
    </div>
  </div>
);

export default FeedInput;
