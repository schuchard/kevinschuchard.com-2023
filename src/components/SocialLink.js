import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics'

export default function SocialLink(props) {
  return (
    <OutboundLink className="navbar-item" href={props.url} target="_blank" rel="noopener noreferrer">
      <span className="icon">
        <img src={props.linkType} alt={props.altType} />
      </span>
    </OutboundLink>
  );
}
