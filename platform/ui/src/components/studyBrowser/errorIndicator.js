import React from 'react';
import PropTypes from 'prop-types';

const ERROR_MESSAGE = {
  404: 'Not available',
};

const ErrorIndicator = props => {
  const { error } = props;
  const message = ERROR_MESSAGE[error];
  return (
    <div className="alt-image-text">
      <h3>{message}</h3>
    </div>
  );
};

ErrorIndicator.propTypes = {
  error: PropTypes.string,
};

export default ErrorIndicator;
