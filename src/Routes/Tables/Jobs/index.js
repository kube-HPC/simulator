import React, { useCallback, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar } from 'cache';
import { JOB_QUERY } from './../../../qraphql/queries';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

// import { _ } from 'core-js';

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;
let limitAmount = 20;
export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
const JobsTable = () => {
  const [queryParams, setQueryParams] = useState({ limit: 20 });
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const query = useQuery(JOB_QUERY, {
    variables: queryParams,
  });
  limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;
  usePolling(query, 3000);

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
    <>
      <Collapse isOpened={filterToggeled}>
        <QueryForm
          onSubmit={values => {
            let datesRange = null;
            const { time, ...other } = values;
            time
              ? (datesRange = {
                  from: time[0]?.toISOString(),
                  to: time[1]?.toISOString(),
                })
              : null;
            Object.values(other).forEach((element, index) => {
              element === ''
                ? (other[Object.keys(other)[index]] = undefined)
                : null;
            });
            //  console.log({ ...other, datesRange });
            setQueryParams({ ...queryParams, ...other, datesRange });
          }}
        />
        <QueryDateChart dataSource={_dataSource} />
      </Collapse>
      <Table
        fetchMore={() =>
          query.fetchMore({
            variables: {
              cursor: query?.data?.jobsAggregated?.cursor,
            },
          })
        }
        loading={query.loading}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
      />
    </>
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
