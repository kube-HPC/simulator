import { algorithmBuildsTable, algorithmTable } from 'reducers/algorithm.reducer';
import { autoCompleteFilter } from 'reducers/autoComplete.reducer';
import { boardURL, connectionStatus, socketURL } from 'reducers/connection.reducer';
import { debugTable } from 'reducers/debug.reducer';
import { drawer } from 'reducers/drawer.reducer';
import { driverTable } from 'reducers/driver.reducer';
import { errorLogsTable } from 'reducers/errorLogs.reducer';
import { filterByType } from 'reducers/filter.reducer';
import { jobsKubernetesLogs, jobsTable } from 'reducers/jobs.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { pipelineTable } from 'reducers/pipeline.reducer';
import { settings } from 'reducers/settings.reducer';
import { boards } from 'reducers/tensorflow.reducer';
import { userGuide } from 'reducers/userGuide.reducer';
import { viewType } from 'reducers/viewType.reducer';
import { workerTable } from 'reducers/worker.reducer';
import { combineReducers } from 'redux';

const store = {
  algorithmBuildsTable,
  algorithmTable,
  autoCompleteFilter,
  boards,
  boardURL,
  connectionStatus,
  debugTable,
  drawer,
  driverTable,
  errorLogsTable,
  filterByType,
  jobsKubernetesLogs,
  jobsTable,
  nodeStatistics,
  pipelineTable,
  settings,
  socketURL,
  userGuide,
  viewType,
  workerTable,
};

export default combineReducers(store);
