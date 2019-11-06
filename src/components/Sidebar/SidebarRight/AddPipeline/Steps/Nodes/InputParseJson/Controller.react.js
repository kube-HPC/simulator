import React, { useState, forwardRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from 'antd';
import InputField from './InputField.react';
import { removeLast } from '../helpers';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

const EMPTY_INITIAL = [];

const Controller = forwardRef(({ onChange, ...props }, ref) => {
  const [inputs, setInputs] = useState(EMPTY_INITIAL);

  useEffect(() => {
    onChange(inputs.map(({ value }) => value));
  }, [inputs, onChange]);

  const onAddInput = () => {
    const onInputChange = value => {
      const id = inputs.length;
      setInputs(prev => {
        prev[id].value = value;
        return [...prev];
      });
    };

    setInputs(prev => {
      const INPUT_INITIAL = {
        component: <InputField {...props} onChange={onInputChange} key={prev.length} />,
        value: ''
      };
      return [...prev, INPUT_INITIAL];
    });
  };

  const onRemoveInput = () => setInputs(removeLast);

  return (
    <>
      {inputs.map(({ component }) => component)}
      <ButtonGroupCenter>
        <Button block icon="plus" type="dashed" onClick={onAddInput}>
          Add Input
        </Button>
        {!!inputs.length && (
          <Button block icon="minus" type="dashed" onClick={onRemoveInput}>
            Remove Last
          </Button>
        )}
      </ButtonGroupCenter>
    </>
  );
});

Controller.propTypes = {
  onChange: PropTypes.func
};

export default memo(Controller);
