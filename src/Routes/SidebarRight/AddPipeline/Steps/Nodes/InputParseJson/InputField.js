import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tryParse } from 'utils';
import RawInputField from 'components/InputField';

const InputField = ({ placeholder, tooltip, onRemove, idx, ...antFields }) => {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState();
  const hasRemove = !!onRemove;
  useEffect(() => {
    if (value === undefined) {
      setValue(antFields.value);
    }
  }, [antFields, value]);

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      setValue(src);
      const onFail = () => setIsValid(src === '');
      const onSuccess = ({ parsed }) => {
        antFields.onChange(parsed);
        setIsValid(true);
      };
      tryParse({ src, onSuccess, onFail });
    },
    [antFields]
  );

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
    />
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  idx: PropTypes.string.isRequired,
  // under antFields
  value: PropTypes.node.isRequired,
  id: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
};

InputField.defaultProps = {
  onRemove: null,
};

export default InputField;
