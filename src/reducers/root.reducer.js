import { combineReducers } from 'redux';

import { jobsTable, jobsKubernetesLogs } from 'reducers/jobs.reducer';

import { workerTable } from 'reducers/worker.reducer';
import { driverTable } from 'reducers/driver.reducer';
import { debugTable } from 'reducers/debug.reducer';

import { algorithmTable, algorithmBuildsTable } from 'reducers/algorithm.reducer';

import { autoCompleteFilter } from 'reducers/autoComplete.reducer';
import { pipelineTable } from 'reducers/pipeline.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { connectionStatus, socketURL } from 'reducers/connection.reducer';
import { userGuide } from 'reducers/userGuide.reducer';
import { errorLogsTable } from 'reducers/errorLogs.reducer';

import { drawer } from 'reducers/drawer.reducer';

const store = {
  algorithmBuildsTable,
  algorithmTable,
  autoCompleteFilter,
  debugTable,
  drawer,
  driverTable,
  errorLogsTable,
  jobsKubernetesLogs,
  jobsTable,
  nodeStatistics,
  pipelineTable,
  userGuide,
  connectionStatus,
  socketURL,
  workerTable,
};

export default combineReducers(store);
