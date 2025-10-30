import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@ant-design/icons';
import { InputNumber, Select, Tooltip, Space } from 'antd';
import parseUnit from 'parse-unit';

const selectStyle = { width: '90px' };

const MemoryField = ({
  onChange,
  children,
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

  const onNumber = target => {
    setNumberMem(target);
    if (target !== null && target !== '' && !Number.isNaN(target)) {
      onChange(`${target}${unit}`);
    } else {
      console.log('children[0]', children[0]);
      console.log('value', value);
      onChange(`${min}${children[0].props.value}`); // default to min K if invalid input
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
        <Select style={selectStyle} value={unit} onChange={onSelect}>
          {children}
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
  onChange: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable */
};

export default MemoryField;
