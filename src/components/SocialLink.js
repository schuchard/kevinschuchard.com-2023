import React from 'react';

export default function SocialLink(props) {
  return (
    <a className="navbar-item" href={props.url} target="_blank" rel="noopener noreferrer">
      <span className="icon">
        <img src={props.linkType} alt={props.altType} />
      </span>
    </a>
  );
}
