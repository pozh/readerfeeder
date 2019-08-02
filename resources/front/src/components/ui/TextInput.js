import React from 'react';

export default ({
  name, type, label, onChange
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type === 'password' ? 'password' : 'text'}
      name={name}
      id={name}
      className="form-control"
      placeholder=""
      onChange={onChange}
    />
  </div>
);
