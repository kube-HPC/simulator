import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Select, Tooltip, Icon } from 'antd';
import parseUnit from 'parse-unit';

const selectStyle = { width: '90px' };

// TODO: remove irrelevant forwardRef
const MemoryField = React.forwardRef(
  // eslint-disable-next-line
  ({ onChange, children, value, tooltipTitle, min, iconType }, ref) => {
    const [numberInitial, unitInitial] = parseUnit(value);

    const [number, setNumber] = useState(numberInitial);
    const [unit, setUnit] = useState(unitInitial);

    const onNumber = target => {
      setNumber(target);
      onChange(target === null || target === '' ? null : `${target}${unit}`);
    };

    const onSelect = target => {
      setUnit(target);
      onChange(number === null ? null : `${number}${target}`);
    };

    const Wrapper = tooltipTitle ? Tooltip : React.Fragment;
    const wrapperProps = tooltipTitle
      ? { title: tooltipTitle, placement: 'topLeft' }
      : {};
    return (
      <Wrapper {...wrapperProps}>
        <Input.Group compact>
          {iconType && <Icon type={iconType} />}
          <InputNumber min={min} value={number} onChange={onNumber} />
          <Select style={selectStyle} value={unit} onChange={onSelect}>
            {children}
          </Select>
        </Input.Group>
      </Wrapper>
    );
  }
);

MemoryField.propTypes = {
  tooltipTitle: PropTypes.string,
  min: PropTypes.number,
  iconType: PropTypes.string,
  // TODO: detail the props
  /* eslint-disable */
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable */
};
MemoryField.defaultProps = {
  tooltipTitle: undefined,
  min: 1,
  iconType: null,
};

export default MemoryField;
