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
import {
  reducer as drivers,
  selectors as driversSelectors,
} from 'reducers/driver.reducer';
import {
  reducer as jobs,
  selectors as jobsSelectors,
} from 'reducers/jobs.reducer';
import {
  reducer as dataSources,
  selectors as dataSourcesSelectors,
} from 'reducers/dataSources';
import {
  reducer as errorLogs,
  selectors as errorLogsSelectors,
} from 'reducers/errorLogs.reducer';
import {
  reducer as connection,
  selectors as connectionSelectors,
} from 'reducers/connection.reducer';
import {
  reducer as experiments,
  selectors as experimentsSelectors,
} from 'reducers/experiment.reducer';

import {
  reducer as queue,
  selectors as queueSelectors,
} from 'reducers/queue.reducer';
import {
  reducer as nodeStatistics,
  selectors as nodeStatisticsSelectors,
} from 'reducers/nodeStatistics.reducer';
import {
  reducer as storage,
  selectors as storageSelectors,
} from 'reducers/storage.reducer';
import {
  reducer as config,
  selectors as configSelectors,
} from 'reducers/config.reducer';
import {
  reducer as settings,
  selectors as settingsSelectors,
} from 'reducers/settings.reducer';
import {
  reducer as boards,
  selectors as boardsSelector,
} from 'reducers/tensorflow.reducer';
import {
  reducer as userGuide,
  selectors as userGuideSelectors,
} from 'reducers/userGuide.reducer';
import {
  reducer as autoCompleteFilter,
  selectors as autoCompleteFilterSelectors,
} from 'reducers/autoComplete.reducer';

const store = {
  algorithms,
  queue,
  boards,
  connection,
  drivers,
  errorLogs,
  experiments,
  jobs,
  nodeStatistics,
  storage,
  pipelines,
  settings,
  userGuide,
  workers,
  config,
  dataSources,
  autoCompleteFilter,
};

export default combineReducers(store);

export const selectors = {
  algorithms: algorithmsSelectors,
  pipelines: pipelinesSelectors,
  workers: workersSelectors,
  drivers: driversSelectors,
  jobs: jobsSelectors,
  queue: queueSelectors,
  dataSources: dataSourcesSelectors,
  errorLogs: errorLogsSelectors,
  connection: connectionSelectors,
  experiments: experimentsSelectors,
  nodeStatistics: nodeStatisticsSelectors,
  config: configSelectors,
  storage: storageSelectors,
  settings: settingsSelectors,
  boards: boardsSelector,
  userGuide: userGuideSelectors,
  autoCompleteFilter: autoCompleteFilterSelectors,
};
