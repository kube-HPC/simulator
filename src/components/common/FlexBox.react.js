import React from 'react';
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

FlexBox.Item = Col;

FlexBox.defaultProps = {
  justify: 'space-between',
  type: 'flex',
  gutter: 10,
};

FlexBox.propTypes = Row.propTypes;

export default FlexBox;
