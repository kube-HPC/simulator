import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Select } from 'antd';
import parseUnit from 'parse-unit';

const selectStyle = { width: '90px' };

const MemoryField = React.forwardRef(
  // TODO: consider remove the forward ref
  // eslint-disable-next-line
  ({ onChange, children, value }, ref) => {
    const [numberInitial, unitInitial] = parseUnit(value);

    const [number, setNumber] = useState(numberInitial);
    const [unit, setUnit] = useState(unitInitial);

    const onNumber = target => {
      setNumber(target);
      onChange(`${target}${unit}`);
    };

    const onSelect = target => {
      setUnit(target);
      onChange(`${number}${target}`);
    };

    return (
      <Input.Group compact>
        <InputNumber min={1} value={number} onChange={onNumber} />
        <Select style={selectStyle} value={unit} onChange={onSelect}>
          {children}
        </Select>
      </Input.Group>
    );
  }
);

MemoryField.propTypes = {
  // TODO: detail the props
  /* eslint-disable  */
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable  */
};

export default MemoryField;
