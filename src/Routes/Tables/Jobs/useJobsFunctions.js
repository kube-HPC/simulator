import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar, useLazyQuery } from '@apollo/client';
import {
  filterToggeledVar,
  instanceFiltersVar,
  metaVar,
  isPinActiveJobVar,
} from 'cache';
import {
  JOB_QUERY,
  JOB_QUERY_GRAPH,
  JOB_QUERY_ACTIVE,
  JOB_ACTIVE_BY_ID_QUERY,
} from 'graphql/queries';
import moment from 'moment';
import usePath from './usePath';

export { default as jobColumns } from './jobColumns';

const topTableScroll = () => {
  const el = document.querySelector('.ant-table-body');
  if (el) el.scrollTop = 0;
};

const useJobsFunctions = () => {
  let zoomedChangedDate = Date.now();

  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const isPinActiveJobs = useReactiveVar(isPinActiveJobVar);
  const metaMode = useReactiveVar(metaVar);

  const [dataSourceGraph, setDataSourceGraph] = useState([]);
  const [JobsActive, setJobsActive] = useState([]);
  const [jobsActiveCompleted, setJobsActiveCompleted] = useState([]);
  const [dataSourceActiveJobs, setDataSourceActiveJobs] = useState([]);
  const [isTableLoad, setIsTableLoad] = useState(true);
  const [isGraphLoad, setIsGraphLoad] = useState(true);

  const { goTo } = usePath();
  const { columns } = useJobs();

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
    let filterJobs = listJobs;
    if (mergedParams.datesRange?.from && mergedParams.datesRange?.to)
      filterJobs = filterJobs.filter(x =>
        moment(x.pipeline.startTime).isBetween(
          mergedParams.datesRange?.from,
          mergedParams.datesRange?.to
        )
      );

    if (mergedParams.pipelineName)
      filterJobs = filterJobs.filter(
        x => x.pipelineName === mergedParams.pipelineName
      );

    if (mergedParams.pipelineStatus)
      filterJobs = filterJobs.filter(
        x => x.pipelineStatus === mergedParams.pipelineStatus
      );

    if (mergedParams.algorithmName)
      filterJobs = filterJobs.filter(
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

      const newJobsActive = JobsActive.filter(ele => ele !== job.key);

      setJobsActive(newJobsActive);
    },
  });
  const margeActiveCompletedJobs = jobsActiveFromDB => {
    const newActiveJobs = [];
    jobsActiveFromDB.forEach(activeJobItem => {
      if (!JobsActive.includes(activeJobItem.key)) {
        newActiveJobs.push(activeJobItem.key);
      }
    });

    setJobsActive(previousState => [...previousState, ...newActiveJobs]);
    const allIdsJobsActiveInTable = dataSourceActiveJobs.map(x => x.key);

    JobsActive.forEach(jobItem => {
      if (!allIdsJobsActiveInTable.includes(jobItem)) {
        getJobByID({ variables: { jobId: jobItem } });
      }
    });
  };

  // Get all active jobs
  const queryActive = useQuery(JOB_QUERY_ACTIVE, {
    displayName: 'JOB_QUERY_ACTIVE',
    // notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    variables: {
      //  ...(!isPinActiveJobs ? mergedParams : mergedParamsReset),
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
        ...(isPinActiveJobs
          ? _dataSourceActive
          : filterListJobs(_dataSourceActive)),
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

  return {
    zoomedChangedDate,
    filterToggeled,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,
    onFetchMore,
    isGraphLoad,
    isTableLoad,
    onRow,
    columns,
    _dataSource,
  };
};

export default useJobsFunctions;
