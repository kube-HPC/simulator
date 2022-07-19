import React, { useCallback, useMemo } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar, instanceFiltersVar } from 'cache';
import { JOB_QUERY } from 'graphql/queries';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;
let limitAmount = 20;
export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
let zoomedChangedDate = Date.now();
// const dateObj = new Date();
const JobsTable = () => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);

  const { goTo } = usePath();
  const { columns } = useJobs();

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      algorithmName: iJobs?.algorithmName || undefined,
      pipelineName: iJobs?.pipelineName || undefined,
      pipelineStatus: iJobs?.pipelineStatus || undefined,
      ...(iJobs?.datesRange?.from &&
        iJobs?.datesRange?.to && {
          datesRange: {
            from: iJobs?.datesRange?.from,
            to: iJobs?.datesRange?.to,
          },
        }),
      limit: 20,
    };

    return items;
  }, [
    instanceFilters.jobs.algorithmName,
    instanceFilters.jobs.pipelineName,
    instanceFilters.jobs.pipelineStatus,
    instanceFilters.jobs?.datesRange?.from,
    instanceFilters.jobs?.datesRange?.to,
  ]);

  const query = useQuery(JOB_QUERY, {
    variables: mergedParams,
  });

  limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;
  usePolling(query, 3000);

  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  const onFetchMore = useCallback(
    () =>
      query.fetchMore({
        variables: {
          cursor: query?.data?.jobsAggregated?.cursor,
          ...mergedParams,
        },
      }),
    [query]
  );

  const onZoomChanged = useCallback(data => {
    let datesRange = null;
    if (data.min) {
      datesRange = {
        from: new Date(data.min).toISOString(),
        to: new Date(data.max).toISOString(),
      };
    }
    // setQueryParams({ ...mergedParams, datesRange, limit: 20 });

    zoomedChangedDate = Date.now();
    query.fetchMore({ variables: { ...mergedParams, datesRange, limit: 20 } });
  });

  const onQuerySubmit = useCallback(values => {
    let datesRange = null;
    const { time, ...other } = values;

    time
      ? (datesRange = {
          from: time[0]?.toISOString(),
          to: time[1]?.toISOString(),
        })
      : null;

    Object.values(other).forEach((element, index) => {
      element === '' ? (other[Object.keys(other)[index]] = undefined) : null;
    });

    const stateInstanceFilter = { ...instanceFiltersVar() };
    stateInstanceFilter.jobs = { ...other, datesRange };

    instanceFiltersVar(stateInstanceFilter);

    // setQueryParams({ ...mergedParams, ...other, datesRange });
  });

  const _dataSource = useMemo(() => {
    if (query && query.data) {
      if (shouldSliceJobs) {
        return query.data.jobsAggregated.jobs.slice(0, jobsAmount);
      }
      return query.data.jobsAggregated.jobs;
    }

    return [];
  }, [query]);

  // const params = useMemo(() => {
  //   return queryParams || {};
  // }, [queryParams]);

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <QueryForm
          zoomDate={zoomedChangedDate}
          onSubmit={onQuerySubmit}
          params={mergedParams}
        />
        <QueryDateChart dataSource={_dataSource} onZoom={onZoomChanged} />
      </Collapse>
      <Table
        fetchMore={onFetchMore}
        loading={query.loading}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        isInfinity
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
