import { Result, Spin } from 'antd';
import React, { Suspense } from 'react';
import styled from 'styled-components';

const CenterImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  height: 50%;
`;

const FallbackComponent = () => (
  <CenterImage>
    <Spin size="large" />
  </CenterImage>
);

const Fallback = ({ children }) => (
  <Suspense fallback={<FallbackComponent />}>{children}</Suspense>
);

Fallback.propTypes = Result.propTypes;

export default Fallback;
