import { LEFT_SIDEBAR_NAMES } from 'const/sidebar-names';
import { STATE_SOURCES } from 'const';

const tableSelector = {
  [LEFT_SIDEBAR_NAMES.JOBS]: {
    sourceName: STATE_SOURCES.JOBS_TABLE,
    mapFunc: job => job.key
  },
  [LEFT_SIDEBAR_NAMES.PIPELINES]: {
    sourceName: STATE_SOURCES.PIPELINE_TABLE,
    mapFunc: pipeline => pipeline.name
  },
  [LEFT_SIDEBAR_NAMES.WORKERS]: {
    sourceName: STATE_SOURCES.WORKER_TABLE,
    mapFunc: algorithm => algorithm.algorithmName
  },
  [LEFT_SIDEBAR_NAMES.DRIVERS]: {
    sourceName: STATE_SOURCES.DRIVER_TABLE,
    mapFunc: driver => driver.driverId
  },
  [LEFT_SIDEBAR_NAMES.ALGORITHMS]: {
    sourceName: STATE_SOURCES.ALGORITHM_TABLE,
    mapFunc: algorithm => algorithm.name
  },
  [LEFT_SIDEBAR_NAMES.DEBUG]: {
    sourceName: STATE_SOURCES.DEBUG_TABLE,
    mapFunc: algorithm => algorithm.name
  },
  [LEFT_SIDEBAR_NAMES.BUILDS]: {
    sourceName: STATE_SOURCES.ALGORITHM_BUILDS_TABLE,
    mapFunc: build => build.buildId
  }
};

const getDataByTable = table => state => {
  if (!tableSelector[table]) return;
  const { sourceName, mapFunc } = tableSelector[table];
  return state[sourceName].dataSource.map(mapFunc);
};

export default getDataByTable;
