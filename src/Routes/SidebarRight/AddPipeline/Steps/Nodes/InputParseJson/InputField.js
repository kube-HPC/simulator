/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Input, Icon, Tooltip, Button } from 'antd';
import { tryParse } from 'utils';
import styled from 'styled-components';
import DeleteButton from '../DeleteButton';

const Field = styled.div`
  display: flex;
  align-items: center;
`;

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
    <Field>
      <Tooltip title={isValid ? '' : tooltip}>
        <Input
          style={{
            width: hasRemove ? '90%' : '100%',
          }}
          id={antFields.id}
          onChange={onInputChange}
          defaultValue={antFields.value}
          value={value}
          placeholder={placeholder}
          addonAfter={
            <Icon
              style={{ color: !isValid && 'red', fontSize: '15px' }}
              type={isValid ? 'check' : 'warning'}
            />
          }
        />
      </Tooltip>
      {hasRemove && (
        <DeleteButton
          type="close-circle"
          theme="filled"
          onClick={() => onRemove(idx)}
        />
      )}
    </Field>
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  idx: PropTypes.string.isRequired,
};

InputField.defaultProps = {
  onRemove: null,
};

export default InputField;
