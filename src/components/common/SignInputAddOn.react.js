import { Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const selectWidth = { width: 150 };

const SignInputAddOn = ({ state, options, callback, isDisabled }) =>
  Array.isArray(options) ? (
    <Select
      value={state}
      style={selectWidth}
      onChange={callback}
      disabled={isDisabled}>
      {options.map(option => {
        if (
          (typeof option === 'object' || typeof option === 'function') &&
          option !== null
        ) {
          return (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          );
        }

        return (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        );
      })}
    </Select>
  ) : (
    state
  );

const arrayOrStringType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.string,
]);
SignInputAddOn.defaultProps = {
  isDisabled: false,
};
SignInputAddOn.propTypes = {
  state: PropTypes.string.isRequired,
  options: arrayOrStringType.isRequired,
  callback: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default SignInputAddOn;
