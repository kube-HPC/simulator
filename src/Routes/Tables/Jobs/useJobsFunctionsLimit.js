import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useJobs, usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  filterToggeledVar,
  instanceFiltersVar,
  metaVar,
  isPinActiveJobVar,
} from 'cache';
import { JOB_QUERY, JOB_QUERY_GRAPH } from 'graphql/queries';

import moment from 'moment';
import usePath from './usePath';

export { default as jobColumns } from './jobColumns';

const topTableScroll = () => {
  const el = document.querySelector('.ant-table-body');
  if (el) el.scrollTop = 0;
};

const getDateTimeZoneString = date => {
  if (date?.isValid()) {
    const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date - tzoffset).toISOString();

    return localISOTime;
  }

  return undefined;
};

const numberLimitJobs = 100;
const dateNow = new Date();
dateNow.setHours(-24);

const useJobsFunctionsLimit = () => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const isPinActiveJob = useReactiveVar(isPinActiveJobVar);

  const metaMode = useReactiveVar(metaVar);
  const [dataSourceGraph, setDataSourceGraph] = useState([]);
  const [zoomedChangedDate, setZoomedChangedDate] = useState(Date.now());
  const [defDate] = useState(getDateTimeZoneString(moment(dateNow)));
  const [isTableLoad, setIsTableLoad] = useState(true);
  const [isGraphLoad, setIsGraphLoad] = useState(true);
  const [limitGetJobs, setLimitGetJobs] = useState(numberLimitJobs);
  const [changeDs, setChangeDs] = useState(0);
  const [isGetMore, setIsGetMore] = useState(true);
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

    if (
      metaMode?.experimentName != null &&
      metaMode?.experimentName !== 'show-all'
    ) {
      items.experimentName = metaMode.experimentName;
    } else {
      items.experimentName = undefined;
    }

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

  // all limit Jobs

  const queryAllJobs = useQuery(JOB_QUERY, {
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'no-cache',
    variables: {
      limit: limitGetJobs,

      ...mergedParams,

      ...(mergedParams?.datesRange?.from === null && {
        datesRange: {
          from: defDate,
          to: mergedParams?.datesRange?.to || null,
        },
      }),

      ...(isPinActiveJob && {
        datesRange: {
          from: null,
          to: null,
        },
      }),
    },

    onCompleted: () => {
      setIsTableLoad(false);
      setChangeDs(!changeDs);
      setIsGetMore(true);
    },
  });
  usePolling(queryAllJobs, 2000);
  // all Jobs to Graph
  const queryGraph = useQuery(JOB_QUERY_GRAPH, {
    // notifyOnNetworkStatusChange: true,

    displayName: 'JOB_QUERY_GRAPH',
    variables: {
      limit: 100000,
      ...mergedParams,
      ...(mergedParams?.datesRange?.from === null && {
        datesRange: {
          from: isPinActiveJob ? null : defDate,
          to: isPinActiveJob ? null : mergedParams?.datesRange?.to || null,
        },
      }),
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

  const onFetchMore = () => {
    setLimitGetJobs(previousState => previousState + numberLimitJobs);
  };

  const onZoomChanged = useCallback(
    data => {
      let datesRange = null;
      if (data.min) {
        datesRange = {
          from: new Date(data.min).toISOString(),
          to: new Date(data.max).toISOString(),
        };
      }

      setZoomedChangedDate(Date.now());
      const stateInstanceFilter = { ...instanceFiltersVar() };
      stateInstanceFilter.jobs = { ...mergedParams, datesRange };

      instanceFiltersVar(stateInstanceFilter);
      setIsTableLoad(true);
      setIsGraphLoad(true);

      topTableScroll();

      setLimitGetJobs(numberLimitJobs);
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

      if (time) {
        datesRange = {
          from: time?.datesRange?.from || undefined,
          to: time?.datesRange?.to || undefined,
        };
      }

      Object.values(other).forEach((element, index) => {
        element === '' ? (other[Object.keys(other)[index]] = undefined) : null;
      });

      const stateInstanceFilter = { ...instanceFiltersVar() };

      stateInstanceFilter.jobs = { ...other, datesRange };

      instanceFiltersVar(stateInstanceFilter);

      topTableScroll();
      setIsTableLoad(true);
      setIsGraphLoad(true);
      setLimitGetJobs(numberLimitJobs);
      queryAllJobs.refetch();
      queryGraph.refetch();
    },
    [queryGraph]
  );

  useEffect(() => {
    setLimitGetJobs(numberLimitJobs);
    queryAllJobs.refetch();
    queryGraph.refetch();
  }, [mergedParams]);

  const onRow = useCallback(
    job => ({
      onDoubleClick: () => goTo.overview({ nextJobId: job.key }),
    }),
    [goTo]
  );

  const _dataSource = useMemo(() => {
    if (queryAllJobs && queryAllJobs.data) {
      const dsAllJobs = queryAllJobs.data.jobsAggregated.jobs;
      return dsAllJobs;
    }

    return [];
  }, [changeDs]);

  useEffect(() => {
    const tableContent = document.querySelector('#jobsTable .ant-table-body');
    tableContent.addEventListener('scroll', event => {
      const maxScroll = event.target.scrollHeight - event.target.clientHeight;

      const currentScroll = event.target.scrollTop;

      if (isGetMore && currentScroll > maxScroll - 10) {
        setIsTableLoad(true);
        setIsGetMore(false);
        onFetchMore();
      }
    });
  }, []);

  return {
    zoomedChangedDate,
    filterToggeled,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,
    isGraphLoad,
    isTableLoad,
    onRow,
    columns,
    _dataSource,
    setLimitGetJobs,
  };
};

export default useJobsFunctionsLimit;
