import { combineReducers } from 'redux';
import {
  algorithmBuildsTable,
  algorithmTable,
} from 'reducers/algorithm.reducer';
import { autoCompleteFilter } from 'reducers/autoComplete.reducer';
import {
  boardURL,
  connectionStatus,
  socketURL,
  hkubeSystemVersion,
} from 'reducers/connection.reducer';
import { debugTable } from 'reducers/debug.reducer';
import { drawer } from 'reducers/drawer.reducer';
import { driverTable } from 'reducers/driver.reducer';
import { errorLogsTable } from 'reducers/errorLogs.reducer';
import { experiments } from 'reducers/experiment.reducer';
import { filterByType } from 'reducers/filter.reducer';
import { jobsKubernetesLogs, jobsTable } from 'reducers/jobs.reducer';
import { meta } from 'reducers/meta.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { storage } from 'reducers/storage.reducer';
import { pipelineTable } from 'reducers/pipeline.reducer';
import { settings } from 'reducers/settings.reducer';
import { boards } from 'reducers/tensorflow.reducer';
import { userGuide } from 'reducers/userGuide.reducer';
import { viewType } from 'reducers/viewType.reducer';
import { workerTable } from 'reducers/worker.reducer';
import { config } from 'reducers/config.reducer';

const store = {
  algorithmBuildsTable,
  algorithmTable,
  meta,
  autoCompleteFilter,
  boards,
  boardURL,
  hkubeSystemVersion,
  connectionStatus,
  debugTable,
  drawer,
  driverTable,
  errorLogsTable,
  experiments,
  filterByType,
  jobsKubernetesLogs,
  jobsTable,
  nodeStatistics,
  storage,
  pipelineTable,
  settings,
  socketURL,
  userGuide,
  viewType,
  workerTable,
  config,
};

export default combineReducers(store);
