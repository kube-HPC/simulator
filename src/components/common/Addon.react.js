import { Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const selectWidth = { width: 90 };

const Addon = ({ state, options, callback, isDisabled }) =>
  Array.isArray(options) ? (
    <Select
      value={state}
      style={selectWidth}
      onChange={callback}
      disabled={isDisabled}>
      {options.map(option => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  ) : (
    state
  );

const arrayOrStringType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.string,
]);
Addon.defaultProps = {
  isDisabled: false,
};
Addon.propTypes = {
  state: PropTypes.string.isRequired,
  options: arrayOrStringType.isRequired,
  callback: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default Addon;
