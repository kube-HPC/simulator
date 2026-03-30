import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Space, Switch } from 'antd';
import styled from 'styled-components';

const InputNumberStyle = styled(InputNumber)`
  width: 140px;
`;

const CompactStyle = styled(Space.Compact)`
  .ant-space-compact-item {
    align-items: center;
    display: inline-flex;
  }
`;

const InputNumberSwitch = forwardRef(
  (
    {
      onChange = () => {}, // To affect the change you need to write a function onChange
      value = '',
    },
    ref
  ) => {
    const [disabled, setDisabled] = useState(value != null && value >= 0);
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
      <CompactStyle>
        <InputNumberStyle
          ref={ref}
          value={numberValue}
          onChange={handleNumberChange}
          disabled={!disabled}
        />
        <span>
          <Switch
            checked={disabled}
            onChange={handleSwitchChange}
            size="small"
          />
        </span>
      </CompactStyle>
    );
  }
);

InputNumberSwitch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputNumberSwitch;
