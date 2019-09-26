import React, { useState, forwardRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';

const selectWidth = { width: 90 };

const Addon = ({ state, options, callback }) =>
  Array.isArray(options) ? (
    <Select value={state} style={selectWidth} onChange={callback}>
      {options.map(option => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  ) : (
    state
  );

const initialByType = target => () => {
  const [first] = Array.isArray(target) ? target : [target];
  return first;
};

const InputValidate = forwardRef(({ before, after, placeholder, onChange }, ref) => {
  const [selectBefore, setSelectBefore] = useState(initialByType(before));
  const [selectAfter, setSelectAfter] = useState(initialByType(after));

  const [inputValue, setInputValue] = useState();
  const onInputChange = e => setInputValue(e.target.value);

  useEffect(() => {
    inputValue && onChange(`${selectBefore}${inputValue}${after}`);
  }, [after, inputValue, onChange, selectBefore]);

  const addonBefore = Addon({ state: selectBefore, options: before, callback: setSelectBefore });
  const addonAfter = Addon({ state: selectAfter, options: after, callback: setSelectAfter });

  return (
    <Input
      value={inputValue}
      onChange={onInputChange}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      placeholder={placeholder}
    />
  );
});

const arrayOrStringType = PropTypes.oneOfType([PropTypes.array, PropTypes.string]);

Addon.propTypes = {
  state: PropTypes.string.isRequired,
  options: arrayOrStringType,
  callback: PropTypes.func.isRequired
};

InputValidate.defaultProps = {
  onChange: () => {}
};

InputValidate.propTypes = {
  before: arrayOrStringType,
  after: arrayOrStringType,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default memo(InputValidate);
