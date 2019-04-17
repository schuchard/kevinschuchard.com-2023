import React from 'react';
import PropTypes from 'prop-types';

export const CardHeader = ({ date, children }) => (
  <div className="k-card-header">
    <div>{children}</div>
    <small>
      <i>{date}</i>
    </small>
  </div>
);

CardHeader.propTypes = {
  date: PropTypes.string,
};

export default CardHeader;
