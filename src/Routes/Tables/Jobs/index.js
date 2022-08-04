import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar, useLazyQuery } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar, instanceFiltersVar, metaVar } from 'cache';
import {
  JOB_QUERY,
  JOB_QUERY_GRAPH,
  JOB_QUERY_ACTIVE,
  JOB_BY_ID_QUERY,
} from 'graphql/queries';
import { Empty } from 'antd';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

// const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
// const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;
// let limitAmount = 20;
export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
let zoomedChangedDate = Date.now();
const topTableScroll = () => {
  const el = document.querySelector('.ant-table-body');
  if (el) el.scrollTop = 0;
};

const localeEmpty = {
  emptyText: (
    <Empty description={<span>No results match your search criteria</span>} />
  ),
};

const JobsTable = () => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const metaMode = useReactiveVar(metaVar);

  const [JobsActive, setJobsActive] = useState([]);
  const [jobsActiveCompleted, setJobsActiveCompleted] = useState([]);
  const [dataSourceJobs, setDataSourceJobs] = useState([]);

  const [isTableLoad, setIsTableLoad] = useState(true);

  const { goTo } = usePath();
  const { columns } = useJobs();

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      algorithmName: iJobs?.algorithmName || undefined,
      pipelineName: iJobs?.pipelineName || undefined,
      pipelineStatus: iJobs?.pipelineStatus || undefined,
      datesRange: {
        from: iJobs?.datesRange?.from || null,
        to: iJobs?.datesRange?.to || null,
      },
    };

    return items;
  }, [
    instanceFilters.jobs,
    instanceFilters.jobs.algorithmName,
    instanceFilters.jobs.pipelineName,
    instanceFilters.jobs.pipelineStatus,
    instanceFilters.jobs?.datesRange?.from,
    instanceFilters.jobs?.datesRange?.to,
  ]);

  // all limit Jobs

  const query = useQuery(JOB_QUERY, {
    //  notifyOnNetworkStatusChange: true,
    variables: {
      experimentName: metaMode?.experimentName || null,
      limit: 10,
      ...mergedParams,
    },
    onCompleted: () => {
      setIsTableLoad(false);
    },
  });
  // usePolling(query, 3000);

  // all Jobs to Graph
  const queryGraph = useQuery(JOB_QUERY_GRAPH, {
    // notifyOnNetworkStatusChange: true,

    displayName: 'JOB_QUERY_GRAPH',
    variables: {
      experimentName: metaMode?.experimentName || null,
      limit: 100000,
      ...mergedParams,
    },
    onCompleted: () => {
      setIsTableLoad(false);
    },
  });
  // usePolling(queryGraph, 3000);

  // limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;

  const onFetchMore = useCallback(() => {
    query.fetchMore({
      variables: {
        cursor: query?.data?.jobsAggregated?.cursor,
      },
    });
  }, [query]);

  const onZoomChanged = useCallback(
    data => {
      let datesRange = null;
      if (data.min) {
        datesRange = {
          from: new Date(data.min).toISOString(),
          to: new Date(data.max).toISOString(),
        };
      }

      zoomedChangedDate = Date.now();

      const stateInstanceFilter = { ...instanceFiltersVar() };
      stateInstanceFilter.jobs = { ...mergedParams, datesRange };

      instanceFiltersVar(stateInstanceFilter);
      setIsTableLoad(true);
      // setJobsCursor(null);
      topTableScroll();
      // query.fetchMore({ variables: { ...mergedParams, datesRange, limit: 20 } });

      query.refetch();
      queryGraph.refetch();
    },
    [mergedParams, query, queryGraph]
  );

  const onQuerySubmit = useCallback(
    values => {
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

      topTableScroll();
      setIsTableLoad(true);

      query.refetch();
      queryGraph.refetch();
    },
    [query, queryGraph]
  );

  const _dataSourceGraph = useMemo(() => {
    if (queryGraph && queryGraph.data) {
      return queryGraph.data.jobsAggregated.jobs;
    }

    return [];
  }, [queryGraph]);

  // Active Jobs
  const [getJobByID] = useLazyQuery(JOB_BY_ID_QUERY, {
    onCompleted: jobCompleted => {
      const { job } = jobCompleted;
      setJobsActiveCompleted(previousState => [job, ...previousState]);
      const newJobsActive = JobsActive.filter(ele => ele.key !== job.key);
      setJobsActive(newJobsActive);
    },
  });
  const margeActiveCompletedJobs = jobsActive => {
    setJobsActive(previousState => [...previousState, ...jobsActive]);

    const allIdsJobsInTable = dataSourceJobs.map(x => x.key);
    const allArrayJobsActive = JobsActive;

    allArrayJobsActive &&
      allArrayJobsActive.forEach(jobItem => {
        if (!allIdsJobsInTable.includes(jobItem.key)) {
          getJobByID({ variables: { jobId: jobItem.key } });
        }
      });
  };

  const queryActive = useQuery(JOB_QUERY_ACTIVE, {
    //  notifyOnNetworkStatusChange: true,
    displayName: 'JOB_QUERY_ACTIVE',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    variables: {
      limit: 200000,
      pipelineStatus: 'active',
      datesRange: {
        from: null,
        to: null,
      },
    },
    onCompleted: res => {
      margeActiveCompletedJobs(
        res?.jobsAggregated?.jobs.filter(x => x.pipeline.name != null)
      );
    },
  });
  usePolling(queryActive, 2000);

  const _dataSourceActive = useMemo(() => {
    if (queryActive && queryActive.data) {
      return queryActive.data.jobsAggregated.jobs.filter(
        x => x.pipeline.name != null
      );
    }

    return [];
  }, [queryActive]);

  const _dataSource = useMemo(() => {
    if (query && query.data) {
      const dsAllJobs = [
        ..._dataSourceActive,
        ...jobsActiveCompleted,
        ...query.data.jobsAggregated.jobs,
      ];
      setDataSourceJobs([
        ..._dataSourceActive,
        ...query.data.jobsAggregated.jobs,
      ]);

      return dsAllJobs;
    }

    return [];
  }, [_dataSourceActive, jobsActiveCompleted, query]);

  useEffect(() => {
    query.refetch();
    queryGraph.refetch();
  }, [mergedParams]);

  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  return (
    <>
      <Collapse isOpened={filterToggeled}>
        <QueryForm
          zoomDate={zoomedChangedDate}
          onSubmit={onQuerySubmit}
          params={mergedParams}
        />

        {_dataSourceGraph && (
          <QueryDateChart
            dataSource={_dataSourceGraph}
            onZoom={onZoomChanged}
          />
        )}
      </Collapse>

      <Table
        id="jobsTable"
        fetchMore={onFetchMore}
        loading={isTableLoad}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        isInfinity
        heightScroll="58vh"
        locale={localeEmpty}
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
