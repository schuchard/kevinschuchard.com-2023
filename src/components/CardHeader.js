import React from 'react';
import PropTypes from 'prop-types';

export const CardHeader = ({ date, futureEvent, children }) => (
  <div className="k-card-header">
    <div>{children}</div>
    <small>{!!futureEvent ? <b>{date}</b> : <i>{date}</i>}</small>
  </div>
);

CardHeader.propTypes = {
  date: PropTypes.string,
};

export default CardHeader;
