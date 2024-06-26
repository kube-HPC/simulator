import { Input } from 'antd';
import PropTypes from 'prop-types';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SignInputAddOn from './SignInputAddOn.react';

const initialByType = target => () => {
  const [first] = Array.isArray(target) ? target : [target];
  return first;
};

const InputAddon = forwardRef(
  (
    {
      before = '',
      after = '',
      onChange = () => {},
      placeholder = '',
      selectWidth = null,
      value = '',
    },
    ref
  ) => {
    const [selectBefore, setSelectBefore] = useState(initialByType(before));
    const [selectAfter, setSelectAfter] = useState(initialByType(after));
    const [inputValue, setInputValue] = useState(value);

    const onInputChange = useCallback(({ target: { value: _value } }) => {
      setInputValue(_value);
    }, []);

    useEffect(() => {
      if (inputValue === '' || value.indexOf(inputValue) === -1)
        setInputValue(value);
    }, [value]);

    useEffect(() => {
      if (Array.isArray(before)) {
        const currValue = inputValue || '';
        const index = before.findIndex(item => currValue.startsWith(item));
        index >= 0 && setSelectBefore(before[index]);
      } else {
        setSelectBefore(before);
      }
    }, [after, before, inputValue]);

    useEffect(() => {
      if (Array.isArray(after)) {
        const index = after.findIndex(item => inputValue.endsWith(item));
        index >= 0 && setSelectAfter(after[index]);
      } else {
        setSelectAfter(after);
      }
    }, [after, before, inputValue]);

    useEffect(() => {
      const beforeValue = selectBefore || initialByType(before);
      const afterValue = selectAfter || initialByType(after);
      const _value = inputValue || '';
      setInputValue(
        _value?.replace(beforeValue, '').replace(afterValue, '') || ''
      );

      const lastValue =
        value?.replace(beforeValue, '').replace(afterValue, '') || '';

      if (lastValue !== inputValue)
        onChange(_value ? `${beforeValue}${_value}${after}` : '');
    }, [inputValue, selectBefore]);

    const addonBefore = useMemo(
      () =>
        SignInputAddOn({
          selectWidth,
          state: selectBefore,
          options: before,
          callback: setSelectBefore,
        }),
      [before, selectBefore]
    );

    const addonAfter = useMemo(
      () =>
        SignInputAddOn({
          selectWidth,
          state: selectAfter,
          options: after,
          callback: setSelectAfter,
        }),
      [after, selectAfter]
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
  }
);

InputAddon.displayName = `InputAddon`;
InputAddon.propTypes = {
  value: PropTypes.string,
  before: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  after: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  selectWidth: PropTypes.number,
};

export default memo(InputAddon);
