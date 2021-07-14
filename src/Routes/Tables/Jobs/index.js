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

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;

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
  const _dataSource = useMemo(
    () => (shouldSliceJobs ? dataSource.slice(0, jobsAmount) : dataSource),
    [dataSource]
  );

  return (
    <div>
      ffff
      <Table
        loading={loading}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
      />
    </div>
  );
};

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
      {showGrid ? <GridViewWrapper /> : <JobsTable />}
      <Route
        exact
        path="/jobs/:jobId/overview/:tabKey"
        component={OverviewDrawer}
      />
    </>
  );
};

export default React.memo(Jobs);
