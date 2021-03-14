import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputNumber, Slider } from 'antd';

const Container = styled.div`
  display: flex;
`;

const SliderNumber = forwardRef(({ onChange, value: initial, min }, ref) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <Container>
      <Slider
        value={value}
        onChange={setValue}
        ref={ref}
        min={min}
        style={{ flex: 1 }}
      />
      <InputNumber value={value} onChange={setValue} />
    </Container>
  );
});
SliderNumber.displayName = `Slider Number`;

SliderNumber.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
};

export default SliderNumber;
