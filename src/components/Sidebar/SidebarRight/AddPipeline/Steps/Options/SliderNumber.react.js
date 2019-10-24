import React, { useState, memo, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Slider, InputNumber } from 'antd';
import { FlexBox } from 'components/common';

const SPAN = 18;
const SPAN_REST = 24 - SPAN;

const SliderNumber = forwardRef(({ onChange, value: initial }, ref) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <FlexBox>
      <FlexBox.Item span={SPAN}>
        <Slider value={value} onChange={setValue} />
      </FlexBox.Item>
      <FlexBox.Item span={SPAN_REST}>
        <InputNumber value={value} onChange={setValue} />
      </FlexBox.Item>
    </FlexBox>
  );
});

SliderNumber.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default memo(SliderNumber);
