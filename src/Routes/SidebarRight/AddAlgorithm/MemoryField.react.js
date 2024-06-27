import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '@ant-design/icons';
import { Input, InputNumber, Select, Tooltip } from 'antd';
import parseUnit from 'parse-unit';

const selectStyle = { width: '90px' };

// TODO: remove irrelevant forwardRef
const MemoryField = React.forwardRef(
  // eslint-disable-next-line
  ({
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
      onChange(target === null || target === '' ? null : `${target}${unit}`);
    };

    const onSelect = target => {
      setUnit(target);
      onChange(numberMem === null ? null : `${numberMem}${target}`);
    };

    const Wrapper = tooltipTitle ? Tooltip : React.Fragment;
    const wrapperProps = tooltipTitle
      ? { title: tooltipTitle, placement: 'topLeft' }
      : {};
    return (
      <Wrapper {...wrapperProps}>
        <Input.Group compact>
          {iconType && <Icon type={iconType} />}
          <InputNumber min={min} value={numberMem} onChange={onNumber} />
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

export default MemoryField;
