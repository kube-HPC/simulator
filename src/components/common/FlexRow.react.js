import React from 'react';
import styled from 'styled-components';

import { Row } from 'antd';

const FlexAligned = styled(Row)`
  align-items: center;
`;

const FlexRow = ({ children, ...props }) => (
  <FlexAligned type="flex" justify="space-between" gutter={10} {...props}>
    {children}
  </FlexAligned>
);

export default FlexRow;
