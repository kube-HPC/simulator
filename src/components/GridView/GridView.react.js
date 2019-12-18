import React from 'react';
import { Card } from 'components/common';
import JobsGridView from 'components/Tables/Jobs/JobsGridView.react';

const GridView = () => (
  <Card bordered={false}>
    <JobsGridView />
  </Card>
);

export default GridView;
