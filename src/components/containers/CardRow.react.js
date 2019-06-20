import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const CenteredCard = styled(Card)`
  margin-right: 50px;
  overflow: auto;
`;

export default function CardRow({ children, ...props }) {
  return (
    <CenteredCard size="small" {...props}>
      {children}
    </CenteredCard>
  );
}
