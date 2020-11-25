import React, { useCallback, useMemo } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQuery from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs } from 'hooks';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';

export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
const JobsTable = () => {
  const { goTo } = usePath();
  const { columns, dataSource, loading } = useJobs();
  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  return (
    <Table
      loading={loading}
      onRow={onRow}
      rowKey={rowKey}
      expandIcon={false}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

const MemoizedJobsTable = React.memo(JobsTable);

const Container = styled(Card)`
  & .ant-card-body {
    padding: 5px;
  }
`;

const GridViewWrapper = React.memo(() => (
  <Container bordered={false}>
    <GridView />
  </Container>
));

const Jobs = () => {
  const query = useQuery();
  const showGrid = useMemo(() => query.get('view') === 'grid', [query]);
  return (
    <>
      {showGrid ? <GridViewWrapper /> : <MemoizedJobsTable />}
      <Route
        exact
        path="/jobs/:jobId/overview/:tabKey"
        component={OverviewDrawer}
      />
    </>
  );
};

export default React.memo(Jobs);
