import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Switch } from 'antd';
import styled from 'styled-components';

const InputNumberStyle = styled(InputNumber)`
  width: 140px;
`;

const InputNumberSwitch = forwardRef(
  (
    {
      onChange = () => {}, // To affect the change you need to write a function onChange
      value,
    },
    ref
  ) => {
    const [disabled, setDisabled] = useState(!!value);
    const [numberValue, setNumberValue] = useState(value);

    // Handle the switch change event
    const handleSwitchChange = checked => {
      let startValue = null;

      if (checked) {
        startValue = 0;
      }

      setDisabled(checked);
      setNumberValue(startValue);
      onChange(startValue);
    };

    // Handle the number input change event
    const handleNumberChange = _value => {
      setNumberValue(_value);
      onChange(_value || '');
    };

    useEffect(() => {
      setNumberValue(value);
    }, [value]);

    return (
      <InputNumberStyle
        ref={ref}
        value={numberValue}
        onChange={handleNumberChange}
        addonAfter={
          <Switch
            checked={disabled}
            onChange={handleSwitchChange}
            size="small"
          />
        }
        disabled={!disabled}
      />
    );
  }
);

InputNumberSwitch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

InputNumberSwitch.defaultProps = {
  onChange: undefined,
  value: '',
};

export default InputNumberSwitch;
