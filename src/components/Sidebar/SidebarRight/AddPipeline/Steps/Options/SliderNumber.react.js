import { InputNumber, Slider } from 'antd';
import { FlexBox } from 'components/common';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import styled from 'styled-components';

const FlexGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const SliderNumber = forwardRef(({ onChange, value: initial, min }, ref) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <FlexBox>
      <FlexGrow>
        <Slider value={value} onChange={setValue} ref={ref} min={min} />
      </FlexGrow>
      <FlexBox.Item>
        <InputNumber value={value} onChange={setValue} />
      </FlexBox.Item>
    </FlexBox>
  );
});

SliderNumber.displayName = `Slider Number`;

SliderNumber.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
};

export default memo(SliderNumber);
