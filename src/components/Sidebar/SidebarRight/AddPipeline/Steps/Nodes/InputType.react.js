import React, { useState, forwardRef, useCallback } from 'react';
import styled from 'styled-components';

import PropTypes from 'prop-types';
import { Input, Icon, Tooltip, Button } from 'antd';
import { handleParsing } from 'utils';

const EMPTY_INPUTS = [];

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

const InputField = ({ placeholder, onChange, tooltip }) => {
  const [isValid, setIsValid] = useState(true);

  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      const onFail = () => setIsValid(src === '' ? true : false);
      const onSuccess = ({ parsed }) => {
        onChange(parsed);
        setIsValid(true);
      };
      handleParsing({ src, onSuccess, onFail });
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
        allowClear
      />
    </Tooltip>
  );
};

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

const InputType = forwardRef((props, ref) => {
  const [inputs, setInputs] = useState(EMPTY_INPUTS);

  const onAddInput = () => {
    setInputs(prev => [...prev, <InputField key={prev.length + 1} {...props} />]);
  };

  const onRemoveInput = () => {
    setInputs(prev => {
      const [, ...rest] = prev.reverse();
      return rest;
    });
  };

  return (
    <>
      {inputs}
      <ButtonGroupCenter>
        <Button block icon="plus" type="dashed" onClick={onAddInput}>
          Add Input
        </Button>
        <Button block icon="minus" type="dashed" onClick={onRemoveInput}>
          Remove Last
        </Button>
      </ButtonGroupCenter>
    </>
  );
});

export default InputType;
