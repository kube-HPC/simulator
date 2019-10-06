import { createSelector } from 'reselect';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';

export const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: {
    sourceName: STATE_SOURCES.JOBS_TABLE,
    mapFunc: job => job.key,
    predicate: filter => row => row.key.includes(filter)
  },
  [LEFT_SIDEBAR_NAMES.PIPELINES]: {
    sourceName: STATE_SOURCES.PIPELINE_TABLE,
    mapFunc: pipeline => pipeline.name,
    predicate: filter => record => record.name.includes(filter)
  },
  [LEFT_SIDEBAR_NAMES.WORKERS]: {
    sourceName: STATE_SOURCES.WORKER_TABLE,
    mapFunc: algorithm => algorithm.algorithmName,
    predicate: filter => row => row.algorithmName.includes(filter)
  },
  [LEFT_SIDEBAR_NAMES.DRIVERS]: {
    sourceName: STATE_SOURCES.DRIVER_TABLE,
    mapFunc: driver => driver.podName,
    predicate: filter => driver => driver.podName && driver.podName.includes(filter)
  },
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: {
    sourceName: STATE_SOURCES.ALGORITHM_TABLE,
    mapFunc: algorithm => algorithm.name,
    predicate: filter => record => record.name.includes(filter)
  },
  [LEFT_SIDEBAR_NAMES.DEBUG]: {
    sourceName: STATE_SOURCES.DEBUG_TABLE,
    mapFunc: algorithm => algorithm.name,
    predicate: filter => algorithm => algorithm.name.includes(filter)
  }
};

export const tableFilterSelector = table => {
  const { sourceName, predicate } = tableSelector[table];

  return createSelector(
    state => state[sourceName].dataSource,
    state => state.autoCompleteFilter.filter,
    (dataSource, filter) => dataSource && dataSource.filter(predicate(filter))
  );
};
