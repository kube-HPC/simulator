// eslint-disable-next-line
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tryParse } from 'utils';
import RawInputField from 'components/InputField';

const InputField = ({ placeholder, tooltip, onRemove, idx, ...antFields }) => {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState();
  const hasRemove = !!onRemove;
  useEffect(() => {
    /**
     * IsValid will override the field most of the time, this is useful when you
     * delete an entry - ant needs to re-write this field you don't want ant to
     * override a field if it is invalid, it will show an "x" and hide the extra
     * invalid characters from the user making it unusable
     */
    if (isValid || value === undefined) {
      if (Number.isNaN(value)) {
        setValue(value);
      } else {
        setValue(JSON.stringify(antFields.value));
      }
    }
  }, [antFields, value, isValid]);

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      setValue(src);
      const onFail = () => setIsValid(src === '');
      const onSuccess = ({ parsed }) => {
        antFields.onChange(parsed);
        setIsValid(true);
      };
      if (src === '') {
        onSuccess({ parsed: undefined });
        setIsValid(false);
      } else {
        tryParse({ src, onSuccess, onFail });
      }
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
