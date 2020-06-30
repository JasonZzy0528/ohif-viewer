import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Button } from '..';

const Footer = ({ actions, withDivisor, className, onSubmit, state }) => {
  const flex = 'flex items-center justify-end';
  const border =
    withDivisor && 'border-t-2 border-solid border-black rounded-b';
  const spacing = 'p-6';

  return (
    <div className={classNames(flex, border, spacing, className)}>
      {actions.map((action, index) => {
        const isFirst = index === 0;
        const isPrimary = action.type === 'primary';

        return (
          <Button
            key={index}
            className={classNames({ 'ml-2': !isFirst })}
            color={isPrimary ? 'primary' : undefined}
            onClick={() => onSubmit({ ...action, state })}
            style={{ transition: 'all .15s ease', height: 34 }}
          >
            {action.text}
          </Button>
        );
      })}
    </div>
  );
};

const noop = () => { };

Footer.propTypes = {
  className: PropTypes.string,
  withDivisor: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.any,
      type: PropTypes.oneOf(['primary', 'secondary', 'cancel']).isRequired,
    })
  ).isRequired,
};

Footer.defaultProps = {
  withDivisor: true,
  onSubmit: noop,
  actions: []
};

export default Footer;