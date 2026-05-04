import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InputNumber, Slider, Form } from 'antd';

const Container = styled.div`
  display: flex;

  .ant-row:first-child {
    flex: 1 1 0;
  }
`;

const SliderNumber = forwardRef(
  (
    {
      onChange = () => {},
      value: initial = 0,
      min = 0,
      name,
      testId = undefined,
    },
    ref
  ) => {
    const [value, setValue] = useState(initial);

    useEffect(() => {
      onChange(value);
    }, [onChange, value]);

    return (
      <Container>
        <Form.Item
          onChange={setValue}
          name={name}
          ref={ref}
          style={{ width: '90%' }}>
          <Slider
            min={min}
            data-testid={testId ? `${testId}-slider` : undefined}
          />
        </Form.Item>

        <Form.Item onChange={setValue} name={name}>
          <InputNumber data-testid={testId ? `${testId}-input` : undefined} />
        </Form.Item>
      </Container>
    );
  }
);
SliderNumber.displayName = `Slider Number`;

SliderNumber.propTypes = {
  name: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  testId: PropTypes.string,
};

export default SliderNumber;
