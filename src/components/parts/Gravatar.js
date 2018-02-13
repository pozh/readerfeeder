import React from 'react';

export const Gravatar = props => {
  const { hash, size } = props;
  const imgSrc = `http://1.gravatar.com/avatar/${hash}?s=${size}`;

  return (
    <div className={props.className}>
      <img alt="" src={imgSrc} className="avatar" height={size} width={size} />
    </div>
  );
};

export default Gravatar;
