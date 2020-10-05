import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Input, Icon, Tooltip } from 'antd';
import { tryParse } from 'utils';

const InputField = ({ placeholder, onChange, tooltip }) => {
  const [isValid, setIsValid] = useState(true);

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      const onFail = () => setIsValid(src === '');
      const onSuccess = ({ parsed }) => {
        onChange(parsed);
        setIsValid(true);
      };
      tryParse({ src, onSuccess, onFail });
    },
    [onChange]
  );

  return (
    <Tooltip title={isValid ? '' : tooltip}>
      <Input
        onChange={onInputChange}
        placeholder={placeholder}
        addonAfter={
          <Icon
            style={{ color: !isValid && 'red', fontSize: '15px' }}
            type={isValid ? 'check' : 'warning'}
          />
        }
      />
    </Tooltip>
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  onChange: PropTypes.func,
};

export default InputField;
