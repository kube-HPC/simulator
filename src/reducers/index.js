import { combineReducers } from 'redux';
import {
  reducer as algorithms,
  selectors as algorithmsSelectors,
} from 'reducers/algorithm.reducer';
import {
  reducer as pipelines,
  selectors as pipelinesSelectors,
} from 'reducers/pipeline.reducer';
import {
  reducer as workers,
  selectors as workersSelectors,
} from 'reducers/worker.reducer';
import { autoCompleteFilter } from 'reducers/autoComplete.reducer';
import {
  reducer as drivers,
  selectors as driversSelectors,
} from 'reducers/driver.reducer';
import {
  reducer as debug,
  selectors as debugSelectors,
} from 'reducers/debug.reducer';
import {
  reducer as jobs,
  selectors as jobsSelectors,
} from 'reducers/jobs.reducer';
import {
  reducer as errorLogs,
  selectors as errorLogsSelectors,
} from 'reducers/errorLogs.reducer';
import {
  reducer as connection,
  selectors as connectionSelectors,
} from 'reducers/connection.reducer';
import { drawer } from 'reducers/drawer.reducer';
import {
  reducer as experiments,
  selectors as experimentsSelectors,
} from 'reducers/experiment.reducer';
import { filterByType } from 'reducers/filter.reducer';
import {
  reducer as meta,
  selectors as metaSelectors,
} from 'reducers/meta.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { storage } from 'reducers/storage.reducer';
import { settings } from 'reducers/settings.reducer';
import { boards } from 'reducers/tensorflow.reducer';
import { userGuide } from 'reducers/userGuide.reducer';
import { viewType } from 'reducers/viewType.reducer';
import { config } from 'reducers/config.reducer';

const store = {
  algorithms,
  meta,
  autoCompleteFilter,
  boards,
  connection,
  debug,
  drawer,
  drivers,
  errorLogs,
  experiments,
  filterByType,
  jobs,
  nodeStatistics,
  storage,
  pipelines,
  settings,
  userGuide,
  viewType,
  workers,
  config,
};

export default combineReducers(store);

export const selectors = {
  algorithms: algorithmsSelectors,
  pipelines: pipelinesSelectors,
  workers: workersSelectors,
  drivers: driversSelectors,
  debug: debugSelectors,
  jobs: jobsSelectors,
  errorLogs: errorLogsSelectors,
  connection: connectionSelectors,
  experiments: experimentsSelectors,
  meta: metaSelectors,
};
