import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  filterToggeledVar,
  instanceFiltersVar,
  metaVar,
  isPinActiveJobVar,
  dateTimeDefaultVar,
} from 'cache';
import { JOB_QUERY, JOB_QUERY_GRAPH } from 'graphql/queries';

import dayjs from 'dayjs';
import usePath from './usePath';
import jobColumns from './jobColumns';

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
  const [_dataSource, setDataSource] = useState([]);
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const filterToggeled = useReactiveVar(filterToggeledVar);
  const isPinActiveJob = useReactiveVar(isPinActiveJobVar);
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);

  const metaMode = useReactiveVar(metaVar);
  const [dataSourceGraph, setDataSourceGraph] = useState([]);
  const [zoomedChangedDate, setZoomedChangedDate] = useState(Date.now());
  const [defDate] = useState(getDateTimeZoneString(dayjs(dateNow)));
  const [isTableLoad, setIsTableLoad] = useState(true);
  const [isGraphLoad, setIsGraphLoad] = useState(true);
  const [limitGetJobs, setLimitGetJobs] = useState(numberLimitJobs);
  const [changeDs, setChangeDs] = useState(0);
  const [isGetMore, setIsGetMore] = useState(true);
  const { goTo } = usePath();
  const firstUpdate = useRef(true);

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      algorithmName: iJobs?.algorithmName || undefined,
      pipelineName: iJobs?.pipelineName || undefined,
      pipelineStatus: iJobs?.pipelineStatus || undefined,
      user: iJobs?.user || undefined,
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
    instanceFilters.jobs.user,
    instanceFilters.jobs?.datesRange?.from,
    instanceFilters.jobs?.datesRange?.to,
    metaMode?.experimentName,
    dateTimeDefault.hour,
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

        ...(isPinActiveJob && {
          datesRange: {
            from: null,
            to: null,
          },
        }),
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

  const onQuerySubmit = useCallback(values => {
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
    // queryAllJobs.refetch();
    // queryGraph.refetch();
  }, []);

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

  useEffect(() => {
    if (queryAllJobs?.data) {
      const dsAllJobs = queryAllJobs.data.jobsAggregated.jobs;
      setDataSource(dsAllJobs);
    } else {
      setDataSource([]);
    }

    setTimeout(() => {
      setIsTableLoad(false);
    }, 1000);
  }, [queryAllJobs.data, changeDs]);

  const handleMaxScroll = useCallback(event => {
    const maxScroll = event.target.scrollHeight - event.target.clientHeight;

    const currentScroll = event.target.scrollTop;

    if (isGetMore && currentScroll > maxScroll - 10) {
      setIsTableLoad(true);
      setIsGetMore(false);
      onFetchMore();
    }
  }, []);

  useEffect(() => {
    const tableContent = document.querySelector('#jobsTable .ant-table-body');
    tableContent.addEventListener('scroll', handleMaxScroll);

    return () => {
      window.removeEventListener('scroll', handleMaxScroll);
    };
  }, [handleMaxScroll]);

  useEffect(() => {
    if (firstUpdate.current) {
      const filter = { ...instanceFilters };
      if (filter.jobs.datesRange.from === null) {
        filter.jobs.datesRange.from = dateTimeDefault.time;
      }
      instanceFiltersVar({ ...filter });
      firstUpdate.current = false;
    }
  }, []);

  const jobColumnsMemo = useMemo(() => {
    if (_dataSource.filter(x => x.externalId != null).length === 0) {
      return jobColumns.filter(x => x.key !== 'externalId');
    }

    return jobColumns;
  }, [_dataSource]);

  return {
    zoomedChangedDate,
    filterToggeled,
    filterToggeledVar,
    onQuerySubmit,
    mergedParams,
    dataSourceGraph,
    debouncedZoomChanged,
    isGraphLoad,
    isTableLoad,
    onRow,
    columns: jobColumnsMemo,
    _dataSource,
    setLimitGetJobs,
  };
};

export default useJobsFunctionsLimit;
