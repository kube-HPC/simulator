import React, { Children } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';

const FlexAligned = styled(Row)`
  align-items: ${({ align = 'center' }) => align};
  flex-direction: ${({ direction = 'row' }) => direction};
`;

const FlexBox = ({ children, justify, align, gutter, ...props }) => (
  <FlexAligned justify={justify} align={align} gutter={gutter} {...props}>
    {children}
  </FlexAligned>
);

FlexBox.propTypes = Row.propTypes;

FlexBox.Item = Col;

FlexBox.defaultProps = {
  justify: 'space-between',
  type: 'flex',
  gutter: 10,
};

const Auto = ({ children, ...props }) => (
  <FlexBox {...props}>
    {Children.map(children, (item, i) => (
      <FlexBox.Item key={i}>{item}</FlexBox.Item>
    ))}
  </FlexBox>
);

Auto.propTypes = FlexBox.propTypes;

FlexBox.Auto = Auto;

export default FlexBox;
