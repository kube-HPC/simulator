import { Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';

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

const arrayOrStringType = PropTypes.oneOfType([PropTypes.array, PropTypes.string]);

Addon.propTypes = {
  state: PropTypes.string.isRequired,
  options: arrayOrStringType,
  callback: PropTypes.func.isRequired,
};

const initialByType = target => () => {
  const [first] = Array.isArray(target) ? target : [target];
  return first;
};

const InputAddon = forwardRef(
  ({ before = '', after = '', onChange = () => {}, placeholder, value }, ref) => {
    const [selectBefore, setSelectBefore] = useState(initialByType(before));
    const [selectAfter, setSelectAfter] = useState(initialByType(after));
    const [inputValue, setInputValue] = useState(value);

    const onInputChange = useCallback(({ target: { value } }) => setInputValue(value), []);

    useEffect(() => {
      if (Array.isArray(before)) {
        const currValue = inputValue || '';
        const index = before.findIndex(value => currValue.startsWith(value));
        index >= 0 && setSelectBefore(before[index]);
      }
    }, [after, before, inputValue, selectAfter, selectBefore]);

    useEffect(() => {
      if (Array.isArray(after)) {
        const index = after.findIndex(value => inputValue.endsWith(value));
        index >= 0 && setSelectAfter(after[index]);
      }
    }, [after, before, inputValue, selectAfter, selectBefore]);

    useEffect(() => {
      const beforeValue = selectBefore || initialByType(before);
      const value = inputValue || '';
      setInputValue(value.replace(beforeValue, '').replace(beforeValue, ''));
      onChange(value ? `${beforeValue}${value}${after}` : '');
    }, [after, before, inputValue, onChange, selectAfter, selectBefore]);

    const addonBefore = useMemo(
      () => Addon({ state: selectBefore, options: before, callback: setSelectBefore }),
      [before, selectBefore],
    );
    const addonAfter = useMemo(
      () => Addon({ state: selectAfter, options: after, callback: setSelectAfter }),
      [after, selectAfter],
    );

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={onInputChange}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        placeholder={placeholder}
      />
    );
  },
);

InputAddon.displayName = `InputAddon`;
InputAddon.propTypes = {
  before: arrayOrStringType,
  after: arrayOrStringType,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  beforeReplaceRgx: PropTypes.object,
  afterReplaceRgx: PropTypes.object,
};

export default memo(InputAddon);
