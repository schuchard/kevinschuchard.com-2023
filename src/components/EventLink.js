import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';

export default function EventLink(props) {
  if (!props.url) {
    return null;
  }

  const linkToName = props.url.replace(new RegExp('^//|^.*?:(//)?', 'gi'), '');
  const trimLength = 35;
  let displayName = props.name || linkToName;

  if (displayName.length > trimLength) {
    displayName = `${displayName.slice(0, trimLength)}...`;
  }
  return (
    <OutboundLink className="event-link" href={props.url} target="_blank" rel="noopener noreferrer">
      {displayName}
    </OutboundLink>
  );
}
