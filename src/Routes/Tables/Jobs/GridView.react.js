import { Card } from 'components/common';
import React from 'react';
import styled from 'styled-components';
import JobsGridView from './JobsGridView.react';

const Container = styled(Card)`
  & .ant-card-body {
    padding: 5px;
  }
`;

const GridView = () => (
  <Container bordered={false}>
    <JobsGridView />
  </Container>
);

export default GridView;
