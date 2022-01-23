// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import RawInputField from 'components/InputField';
import useInputField from './useInputField';

const InputField = ({ placeholder, tooltip, idx, onRemove, ...antFields }) => {
  const {
    addonBefore,
    onInputChange,
    hasRemove,
    isValid,
    value,
  } = useInputField(antFields, onRemove);

  return (
    <RawInputField
      id={antFields.id}
      tooltip={tooltip}
      hasRemove={hasRemove}
      isValid={isValid}
      onRemove={() => onRemove(idx)}
      value={value}
      onChange={onInputChange}
      placeholder={placeholder}
      addonBefore={addonBefore}
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
  addonBefore: PropTypes.arrayOf(PropTypes.string),
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
