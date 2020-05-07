import React from 'react';

const TextInput = ({
  name, type, required, label, value, onChange
}) => (
  <div className="form-group">
    <label htmlFor={name}>
      {label}
      {required ? <sup className="font-weight-bold text-danger"> *</sup> : ''}
    </label>
    <input
      type={type === 'password' ? 'password' : 'text'}
      name={name}
      id={name}
      required={required}
      className="form-control"
      placeholder=""
      defaultValue={value}
      onChange={onChange}
    />
  </div>
);

export default TextInput;
