import React from 'react';
import { Card } from 'components/common';
import JobsGridView from 'components/Tables/Jobs/JobsGridView.react';
import styled from 'styled-components';

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
