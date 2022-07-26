import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import useQueryHook from 'hooks/useQuery';
import { Table } from 'components';
import { Card } from 'components/common';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Collapse } from 'react-collapse';
import { filterToggeledVar, instanceFiltersVar, metaVar } from 'cache';
import { JOB_QUERY, JOB_QUERY_GRAPH } from 'graphql/queries';
import GridView from './GridView';
import OverviewDrawer from './OverviewDrawer';
import usePath from './usePath';
import QueryForm from './QueryTable/QueryForm';
import QueryDateChart from './QueryTable/QueryDateChart';

const jobsAmount = parseInt(process.env.REACT_APP_SLICE_JOBS, 10);
const shouldSliceJobs = Number.isInteger(jobsAmount) && jobsAmount > 0;
// let limitAmount = 20;
export { default as jobColumns } from './jobColumns';
const rowKey = job => `job-${job.key}`;
let zoomedChangedDate = Date.now();
const topTableScroll = () => {
  const el = document.querySelector('.ant-table-body');
  if (el) el.scrollTop = 0;
};

const JobsTable = () => {
  const firstRender = useRef(true);
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const metaMode = useReactiveVar(metaVar);

  const [jobsCursor, setJobsCursor] = useState(null);
  const [isFetchMore, setIsFetchMore] = useState(0);
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

  const query = useQuery(JOB_QUERY, {
    notifyOnNetworkStatusChange: true,

    onCompleted: () =>
      setTimeout(() => {
        setIsTableLoad(false);
      }, 3000),
    variables: {
      experimentName: metaMode?.experimentName || null,
      cursor: jobsCursor,
      limit: 20,
      ...mergedParams,
    },
  });
  usePolling(query, 3000);

  const queryGraph = useQuery(JOB_QUERY_GRAPH, {
    notifyOnNetworkStatusChange: true,
    displayName: 'JOB_QUERY_GRAPH',
    variables: {
      experimentName: metaMode?.experimentName || null,
      limit: 100000,
      ...mergedParams,
    },
  });
  usePolling(queryGraph, 3000);
  // limitAmount = query?.data?.jobsAggregated.jobs?.length || limitAmount;

  useEffect(() => {
    setIsTableLoad(true);
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setJobsCursor(query?.data?.jobsAggregated?.cursor);
    }
  }, [isFetchMore]);
  /*
  const onFetchMore = useCallback(() =>
  {
  console.log("query?.data?.jobsAggregated?.cursor",query?.data?.jobsAggregated?.cursor)
  query.fetchMore({
    variables: {
      experimentName: metaMode?.experimentName || null,
      cursor: query?.data?.jobsAggregated?.cursor,
      limit: 20,
      updateQuery: () => {console.log(222);setTimeout(()=>{setIsFetchMore(isFetchMore + 1)},100 )}  ,
      ...mergedParams,
    },
  })
  }
  , [isFetchMore, mergedParams, metaMode?.experimentName, query]);
*/
  const onFetchMore = useCallback(() => {
    setIsFetchMore(isFetchMore + 1);
  }, [isFetchMore]);

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
      setJobsCursor(null);
      topTableScroll();
      // query.fetchMore({ variables: { ...mergedParams, datesRange, limit: 20 } });
    },
    [mergedParams]
  );

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
    setJobsCursor(null);
    topTableScroll();
    setIsTableLoad(true);
  }, []);

  const _dataSourceGraph = useMemo(() => {
    if (queryGraph && queryGraph.data) {
      if (shouldSliceJobs) {
        return queryGraph.data.jobsAggregated.jobs.slice(0, jobsAmount);
      }
      return queryGraph.data.jobsAggregated.jobs;
    }

    return [];
  }, [queryGraph]);

  const _dataSource = useMemo(() => {
    if (query && query.data) {
      if (shouldSliceJobs) {
        return query.data.jobsAggregated.jobs.slice(0, jobsAmount);
      }
      return query.data.jobsAggregated.jobs;
    }

    return [];
  }, [query]);

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
        <QueryDateChart dataSource={_dataSourceGraph} onZoom={onZoomChanged} />
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
