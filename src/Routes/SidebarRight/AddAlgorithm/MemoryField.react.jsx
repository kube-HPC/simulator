import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@ant-design/icons';
import { InputNumber, Select, Tooltip, Space } from 'antd';
import parseUnit from 'parse-unit';

const selectStyle = { width: '90px' };

const MemoryField = ({
  onChange,
  children,
  options = null,
  value,
  tooltipTitle = undefined,
  min = 1,
  iconType = null,
}) => {
  const [numberInitial, unitInitial] = parseUnit(value);
  const [numberMem, setNumberMem] = useState(numberInitial);
  const [unit, setUnit] = useState(unitInitial);

  useEffect(() => {
    setNumberMem(numberInitial);
    setUnit(unitInitial);
  }, [numberInitial, unitInitial]);

  const childOptions = React.Children.toArray(children);
  const optionsList =
    options || childOptions.map(option => ({ value: option?.props?.value }));
  const firstOptionValue = optionsList?.[0]?.value;

  const onNumber = target => {
    setNumberMem(target);
    if (target !== null && target !== '' && !Number.isNaN(target)) {
      onChange(`${target}${unit}`);
    } else {
      onChange(`${min}${firstOptionValue || ''}`); // default to min K if invalid input
    }
  };

  const onSelect = target => {
    setUnit(target);
    onChange(numberMem === null ? min : `${numberMem}${target}`);
  };

  const Wrapper = tooltipTitle ? Tooltip : React.Fragment;
  const wrapperProps = tooltipTitle
    ? { title: tooltipTitle, placement: 'topLeft' }
    : {};
  return (
    <Wrapper {...wrapperProps}>
      <Space.Compact>
        {iconType && <Icon type={iconType} />}
        <InputNumber min={min} value={numberMem} onChange={onNumber} />
        <Select
          style={selectStyle}
          value={unit}
          onChange={onSelect}
          options={options}>
          {!options && children}
        </Select>
      </Space.Compact>
    </Wrapper>
  );
};

MemoryField.propTypes = {
  tooltipTitle: PropTypes.string,
  min: PropTypes.number,
  iconType: PropTypes.string,
  // TODO: detail the props
  /* eslint-disable */
  children: PropTypes.node,
  options: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable */
};

export default MemoryField;
