import React from 'react';
import styled from 'styled-components';
import { Row } from 'antd';

const FlexAligned = styled(Row)`
  align-items: center;
  flex-direction: row;
`;

const FlexRow = ({ children, ...props }) => <FlexAligned {...props}>{children}</FlexAligned>;

export default FlexRow;

FlexRow.defaultProps = {
  justify: 'space-between',
  type: 'flex',
  gutter: 10
};

FlexRow.propTypes = {
  ...Row.propTypes
};
