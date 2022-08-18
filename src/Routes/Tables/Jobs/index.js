import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
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
  JOB_ACTIVE_BY_ID_QUERY,
} from 'graphql/queries';
import { Divider, Empty } from 'antd';
import moment from 'moment';
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

  const [dataSourceGraph, setDataSourceGraph] = useState([]);
  const [JobsActive, setJobsActive] = useState([]);
  const [jobsActiveCompleted, setJobsActiveCompleted] = useState([]);
  const [dataSourceActiveJobs, setDataSourceActiveJobs] = useState([]);
  const [isPinActiveJobs, setIsPinActiveJobs] = useState(false);

  const [isTableLoad, setIsTableLoad] = useState(true);
  const [isGraphLoad, setIsGraphLoad] = useState(true);

  const { goTo } = usePath();
  const { columns } = useJobs();

  const mergedParamsReset = {
    algorithmName: undefined,
    pipelineName: undefined,
    pipelineStatus: undefined,
    datesRange: {
      from: null,
      to: null,
    },
  };

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      experimentName: metaMode?.experimentName || null,
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
    metaMode?.experimentName,
  ]);

  const filterListJobs = listJobs => {
    let filterJobs = [];
    if (mergedParams.datesRange?.from && mergedParams.datesRange?.to)
      filterJobs = listJobs.filter(x =>
        moment(x.pipeline.startTime).isBetween(
          mergedParams.datesRange?.from,
          mergedParams.datesRange?.to
        )
      );

    if (mergedParams.pipelineName)
      filterJobs = listJobs.filter(
        x => x.pipelineName === mergedParams.pipelineName
      );

    if (mergedParams.pipelineStatus)
      filterJobs = listJobs.filter(
        x => x.pipelineStatus === mergedParams.pipelineStatus
      );

    if (mergedParams.algorithmName)
      filterJobs = listJobs.filter(
        x => x.algorithmName === mergedParams.algorithmName
      );

    return filterJobs;
  };

  // all limit Jobs
  const queryAllJobs = useQuery(JOB_QUERY, {
    //  notifyOnNetworkStatusChange: true,
    variables: {
      limit: 100,
      ...mergedParams,
    },
    onCompleted: () => {
      setIsTableLoad(false);
    },
  });

  // all Jobs to Graph
  const queryGraph = useQuery(JOB_QUERY_GRAPH, {
    // notifyOnNetworkStatusChange: true,

    displayName: 'JOB_QUERY_GRAPH',
    variables: {
      limit: 100000,
      ...mergedParams,
    },
    onCompleted: resGraph => {
      if (resGraph && resGraph?.jobsAggregated?.jobs) {
        setDataSourceGraph(resGraph.jobsAggregated.jobs);
      } else {
        setDataSourceGraph([]);
      }

      setIsGraphLoad(false);
    },
  });

  // limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;

  const onFetchMore = useCallback(() => {
    queryAllJobs.fetchMore({
      variables: {
        cursor: queryAllJobs?.data?.jobsAggregated?.cursor,
      },
    });
  }, [queryAllJobs]);

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
      setIsGraphLoad(true);
      topTableScroll();

      queryAllJobs.refetch();
      queryGraph.refetch();
    },
    [mergedParams, queryAllJobs, queryGraph]
  );
  const debouncedZoomChanged = useDebouncedCallback(onZoomChanged, 1000);

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
      setIsGraphLoad(true);

      queryAllJobs.refetch();
      queryGraph.refetch();
    },
    [queryAllJobs, queryGraph]
  );

  // Active Jobs push after Completed
  const [getJobByID] = useLazyQuery(JOB_ACTIVE_BY_ID_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: jobCompleted => {
      const { job } = jobCompleted;
      setJobsActiveCompleted(previousState => [job, ...previousState]);
      const newJobsActive = JobsActive.filter(ele => ele.key !== job.key);
      setJobsActive(newJobsActive);
    },
  });
  const margeActiveCompletedJobs = jobsActiveFromDB => {
    setJobsActive(previousState => [...previousState, ...jobsActiveFromDB]);
    const allIdsJobsActiveInTable = dataSourceActiveJobs.map(x => x.key);
    JobsActive.forEach(jobItem => {
      if (!allIdsJobsActiveInTable.includes(jobItem.key)) {
        getJobByID({ variables: { jobId: jobItem.key } });
      }
    });
  };

  // Get all active jobs
  const queryActive = useQuery(JOB_QUERY_ACTIVE, {
    displayName: 'JOB_QUERY_ACTIVE',
    // notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    variables: {
      ...(!isPinActiveJobs ? mergedParams : mergedParamsReset),
      limit: 200000,
      pipelineStatus: 'active',
    },
    onCompleted: res => {
      margeActiveCompletedJobs(
        res?.jobsAggregated?.jobs?.filter(x => x.pipeline.name != null) || []
      );
    },
  });
  usePolling(queryActive, 2000);

  const _dataSourceActive = useMemo(() => {
    if (queryActive && queryActive.data) {
      return (
        queryActive.data.jobsAggregated.jobs?.filter(
          x => x.pipeline.name != null
        ) || []
      );
    }

    return [];
  }, [queryActive, isPinActiveJobs]);

  const _dataSource = useMemo(() => {
    if (queryAllJobs && queryAllJobs.data) {
      const dsAllJobs = [
        ..._dataSourceActive,
        ...filterListJobs(jobsActiveCompleted),
        ...queryAllJobs.data.jobsAggregated.jobs.filter(
          x => x.status.status !== 'active' && x.status.status !== 'pending'
        ),
      ];

      setDataSourceActiveJobs([
        ..._dataSourceActive,
        ...queryAllJobs.data.jobsAggregated.jobs.filter(
          x => x.status.status === 'active'
        ),
      ]);

      return dsAllJobs;
    }

    return [];
  }, [_dataSourceActive, jobsActiveCompleted, queryAllJobs, isPinActiveJobs]);

  useEffect(() => {
    setJobsActiveCompleted([]);
    queryAllJobs.refetch();
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
          setIsPinActiveJobs={setIsPinActiveJobs}
          isPinActiveJobs={isPinActiveJobs}
        />

        {dataSourceGraph && (
          <QueryDateChart
            dataSource={dataSourceGraph}
            onZoom={debouncedZoomChanged}
          />
        )}

        <Divider />
      </Collapse>

      <Table
        id="jobsTable"
        fetchMore={onFetchMore}
        loading={isTableLoad && isGraphLoad}
        onRow={onRow}
        rowKey={rowKey}
        expandIcon={false}
        columns={columns}
        dataSource={_dataSource}
        pagination={false}
        isInfinity
        heightScroll={filterToggeled ? '58vh' : '88vh'}
        locale={localeEmpty}
        rowClassName={record => {
          if (record.status.status === 'active') {
            return 'active-row';
          }
          return null;
        }}
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
