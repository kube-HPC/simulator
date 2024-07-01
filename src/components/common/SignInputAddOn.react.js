import { Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const SignInputAddOn = ({
  state,
  options,
  callback,
  isDisabled = false,
  selectWidth = null,
}) =>
  Array.isArray(options) ? (
    <Select
      value={state}
      style={{ width: selectWidth }}
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

SignInputAddOn.propTypes = {
  state: PropTypes.string.isRequired,
  options: arrayOrStringType.isRequired,
  callback: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  selectWidth: PropTypes.number,
};

export default SignInputAddOn;
