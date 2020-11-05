import { Button } from 'antd';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { removeLast } from '../helpers';
import InputField from './InputField.react';

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
        // TODO: remove this mutation!
        // eslint-disable-next-line
        prev[id].value = value;
        return [...prev];
      });
    };

    setInputs(prev => {
      const INPUT_INITIAL = {
        component: (
          <InputField
            // eslint-disable-next-line
            {...props}
            onChange={onInputChange}
            key={prev.length}
          />
        ),
        value: '',
      };
      return [...prev, INPUT_INITIAL];
    });
  };

  const onRemoveInput = () => setInputs(removeLast);

  return (
    <div ref={ref}>
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
    </div>
  );
});

Controller.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  onChange: PropTypes.func,
};

export default memo(Controller);
