import React from 'react';
import { Card } from 'components/common';
import styled from 'styled-components';
import JobsGridView from 'components/Tables/Jobs/JobsGridView.react';

const Container = styled.div`
  padding: 5px;
`;

const GridView = () => (
  <Container>
    <Card>
      <JobsGridView />
    </Card>
  </Container>
);

export default GridView;
