// eslint-disable-next-line
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import RawInputField from 'components/InputField';
import useInputField from './useInputField';

function isObject(element) {
  return (
    typeof element === 'object' && element !== null && !Array.isArray(element)
  );
}

const InputField = ({ placeholder, tooltip, idx, onRemove, ...antFields }) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  } = useInputField(antFields, onRemove, inputRef, 200);

  return (
    <RawInputField
      id={antFields.id}
      tooltip={tooltip}
      hasRemove={hasRemove}
      isValid={isValid}
      onRemove={() => onRemove(idx)}
      value={isObject(value) ? JSON.stringify(value) : value}
      onChange={onInputChange}
      placeholder={placeholder}
      addonBefore={addonBefore}
      inputRef={inputRef}
    />
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string,
  tooltip: PropTypes.string,
  onRemove: PropTypes.func,
  idx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isValid: PropTypes.bool,
  // under antFields
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.node,
  ]),
  id: PropTypes.node,
  onChange: PropTypes.func,
  addonBefore: PropTypes.arrayOf(PropTypes.object),
};

InputField.defaultProps = {
  placeholder: null,
  tooltip: null,
  onRemove: null,
  value: undefined,
  id: undefined,
  onChange: undefined,
  addonBefore: undefined,
  idx: undefined,
  isValid: true,
};

export default InputField;
