import { combineReducers } from 'redux';

import { jobsTable, jobsJaeger, jobsKubernetesLogs } from 'reducers/jobs.reducer';

import { workerTable } from 'reducers/worker.reducer';
import { driverTable } from 'reducers/driver.reducer';
import { debugTable } from 'reducers/debug.reducer';

import { algorithmTable, algorithmBuildsTable, algorithmReadme } from 'reducers/algorithm.reducer';

import { autoCompleteFilter } from 'reducers/autoComplete.reducer';
import { pipelineTable, pipelineReadme } from 'reducers/pipeline.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { connectionStatus, socketURL } from 'reducers/connection.reducer';
import { userGuide } from 'reducers/userGuide.reducer';
import { errorLogsTable } from 'reducers/errorLogs.reducer';

const dataSources = {
  algorithmBuildsTable,
  algorithmReadme,
  algorithmTable,
  autoCompleteFilter,
  debugTable,
  driverTable,
  errorLogsTable,
  jobsJaeger,
  jobsKubernetesLogs,
  jobsTable,
  nodeStatistics,
  pipelineReadme,
  pipelineTable,
  userGuide,
  connectionStatus,
  socketURL,
  workerTable
};

export default combineReducers(dataSources);
