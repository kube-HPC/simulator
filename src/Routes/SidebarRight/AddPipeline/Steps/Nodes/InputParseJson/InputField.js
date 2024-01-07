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

const InputField = ({
  typeValue,
  placeholder,
  tooltip,
  idx,
  onRemove,
  ...antFields
}) => {
  const inputRef = useRef();

  const {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  } = useInputField(antFields, onRemove, inputRef, 200);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef?.current?.focus();

      if (value !== '' && typeValue === 'string' && !value.startsWith('"')) {
        onInputChange({
          target: { value: `"${inputRef.current.input.value}"` },
        });
      }
    }
  }, []);
  const setValueByType = () => {
    if (isObject(value) || Array.isArray(value)) {
      return JSON.stringify(value);
    }

    return value;
  };
  return (
    <RawInputField
      id={antFields.id}
      tooltip={tooltip}
      hasRemove={hasRemove}
      isValid={isValid}
      onRemove={() => onRemove(idx)}
      value={setValueByType()}
      onChange={onInputChange}
      placeholder={placeholder}
      addonBefore={addonBefore}
      inputRef={inputRef}
    />
  );
};

InputField.propTypes = {
  typeValue: PropTypes.string.isRequired,
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
