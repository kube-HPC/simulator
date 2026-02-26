import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  filterToggeledVar,
  instanceFiltersVar,
  instanceCounterVar,
  metaVar,
  isPinActiveJobVar,
  dateTimeDefaultVar,
} from 'cache';
import { JOB_QUERY, JOB_QUERY_GRAPH } from 'graphql/queries';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import usePath from './usePath';
import jobColumns from './jobColumns';

dayjs.extend(isBetween);

const topTableScroll = () => {
  const el = document.querySelector('#jobsTable .ag-body-viewport');
  if (el) el.scrollTop = 0;
};

const getDateTimeZoneString = date => {
  if (date?.isValid()) {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
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
  const defDate = useMemo(
    () =>
      getDateTimeZoneString(
        dateTimeDefault?.time ? dateTimeDefault.time : dayjs(dateNow)
      ),
    [dateTimeDefault?.time]
  );
  const [isTableLoad, setIsTableLoad] = useState(true);
  const [isGraphLoad, setIsGraphLoad] = useState(true);
  const [limitGetJobs, setLimitGetJobs] = useState(numberLimitJobs);
  const [changeDs, setChangeDs] = useState(0);
  const [isGetMore, setIsGetMore] = useState(true);
  const { goTo } = usePath();
  const firstUpdate = useRef(true);

  // Boolean state to track external ID column visibility
  // Uses boolean instead of array dependency to prevent unnecessary re-renders
  const [hasExternalId, setHasExternalId] = useState(true);

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      algorithmName: iJobs?.algorithmName || undefined,
      pipelineName: iJobs?.pipelineName || undefined,
      pipelineStatus: iJobs?.pipelineStatus || undefined,
      user: iJobs?.user || undefined,
      tag: iJobs?.tag || undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceFilters.jobs, metaMode?.experimentName, dateTimeDefault.hour]);

  const queryAllJobs = useQuery(JOB_QUERY, {
    notifyOnNetworkStatusChange: true,
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
      setChangeDs(previousState => !previousState);
      setIsGetMore(true);
    },
  });

  usePolling(queryAllJobs, 2000);

  const queryGraph = useQuery(JOB_QUERY_GRAPH, {
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
      queryAllJobs.refetch().then(() => {
        setTimeout(() => {
          setIsTableLoad(false);
        }, 2000);
      });
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
  }, []);

  useEffect(() => {
    setLimitGetJobs(numberLimitJobs);
    queryAllJobs.refetch().then(() => {
      setTimeout(() => {
        setIsTableLoad(false);
      }, 2000);
    });
    queryGraph.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Update external ID visibility state
      const hasExtId = dsAllJobs.some(x => x.externalId != null);
      setHasExternalId(hasExtId);

      instanceCounterVar({
        ...instanceCounterVar(),
        jobsFiltered: dsAllJobs.length,
      });
    }
  }, [queryAllJobs.data, changeDs]);

  const handleBodyScroll = useCallback(
    params => {
      const lastRow = params.api.getLastDisplayedRowIndex();
      const totalRows = params.api.getDisplayedRowCount();

      if (isGetMore && lastRow >= totalRows - 1 && !queryAllJobs.loading) {
        setIsGetMore(false);
        onFetchMore();
      }
    },
    [isGetMore, queryAllJobs.loading]
  );

  useEffect(() => {
    if (firstUpdate.current) {
      const filter = {
        ...instanceFilters,
        jobs: {
          ...instanceFilters.jobs,
          datesRange: { ...instanceFilters.jobs.datesRange },
        },
      };
      if (filter.jobs.datesRange.from === null) {
        filter.jobs.datesRange.from = dateTimeDefault.time;
      }
      instanceFiltersVar(filter);
      firstUpdate.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!firstUpdate.current) {
      queryAllJobs.refetch().then(() => setIsGetMore(true));
    }
  }, [limitGetJobs]);

  /**
   * Memoized column definitions with stable references
   * Caches both filtered and unfiltered column arrays to prevent
   * AG-Grid from resetting column state (widths, positions, etc.)
   */
  const columnsRef = useRef({
    withExternal: jobColumns,
    withoutExternal: null,
  });

  const jobColumnsMemo = useMemo(() => {
    if (!hasExternalId) {
      // Lazily create and cache filtered columns (without external ID)
      if (!columnsRef.current.withoutExternal) {
        columnsRef.current.withoutExternal = jobColumns.filter(
          x => x.field !== 'externalId'
        );
      }
      return columnsRef.current.withoutExternal;
    }
    return columnsRef.current.withExternal;
  }, [hasExternalId]);

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
    handleBodyScroll,
  };
};

export default useJobsFunctionsLimit;
