import { combineReducers } from 'redux';

import {
  jobsTable,
  jobsJaeger,
  jobsKubernetesLogs
} from 'reducers/jobs.reducer';

import { workerTable } from 'reducers/worker.reducer';
import { driverTable } from 'reducers/driver.reducer';
import { debugTable } from 'reducers/debug.reducer';

import {
  algorithmTable,
  algorithmBuildsTable,
  algorithmReadme
} from 'reducers/algorithm.reducer';

import { autoCompleteFilter } from 'reducers/layout.reducer';
import { pipelineTable, pipelineReadme } from 'reducers/pipeline.reducer';
import { nodeStatistics } from 'reducers/nodeStatistics.reducer';
import { userGuide } from 'reducers/userGuide.reducer';

const dataSources = {
  algorithmBuildsTable,
  algorithmReadme,
  algorithmTable,
  autoCompleteFilter,
  debugTable,
  driverTable,
  jobsJaeger,
  jobsKubernetesLogs,
  jobsTable,
  nodeStatistics,
  pipelineReadme,
  pipelineTable,
  userGuide,
  workerTable
};

export const sourcesNames = {
  ALGORITHM_BUILDS_TABLE: 'algorithmBuildsTable',
  ALGORITHM_README: 'algorithmReadme',
  ALGORITHM_TABLE: 'algorithmTable',
  AUTO_COMPLETE_FILTER: 'autoCompleteFilter',
  DEBUG_TABLE: 'debugTable',
  DRIVER_TABLE: 'driverTable',
  JOBS_JAEGER: 'jobsJaeger',
  JOBS_KUBERNETES_LOGS: 'jobsKubernetesLogs',
  JOBS_TABLE: 'jobsTable',
  NODE_STATISTICS: 'nodeStatistics',
  PIPELINE_README: 'pipelineReadme',
  PIPELINE_TABLE: 'pipelineTable',
  WORKER_TABLE: 'workerTable',
  USER_GUIDE: 'userGuide'
};

export default combineReducers(dataSources);
