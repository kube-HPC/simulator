import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';

const FlexAligned = styled(Row)`
  align-items: center;
  flex-direction: row;
`;

const FlexBox = ({ children, ...props }) => <FlexAligned {...props}>{children}</FlexAligned>;

FlexBox.Item = Col;

FlexBox.defaultProps = {
  justify: 'space-between',
  type: 'flex',
  gutter: 10
};

FlexBox.propTypes = {
  ...Row.propTypes
};

export default FlexBox;
