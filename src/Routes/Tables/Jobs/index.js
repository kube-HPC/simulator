import React, { useCallback, useMemo, useEffect } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs } from 'hooks';
import { useQuery } from '@apollo/client';
import { JOB_QUERY } from './../../../qraphql/queries';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;

export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
const JobsTable = () => {
  const query = useQuery(JOB_QUERY);

  useEffect(() => {
    query.startPolling(3000);
    //  console.log('polling');
    return () => {
      query.stopPolling();
      //   console.log('stop polling');
    };
  }, [query]);

  const { goTo } = usePath();
  const { columns } = useJobs();
  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  const _dataSource = useMemo(() => {
    if (query && query.data) {
      if (shouldSliceJobs) {
        return query.data.jobsAggregated.jobs.slice(0, jobsAmount);
      }
      return query.data.jobsAggregated.jobs;
    }
    return [];
  }, [query]);

  return (
    <Table
      loading={query.loading}
      onRow={onRow}
      rowKey={rowKey}
      expandIcon={false}
      columns={columns}
      dataSource={_dataSource}
      pagination={false}
    />
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
  const query = useQueryHook();
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
