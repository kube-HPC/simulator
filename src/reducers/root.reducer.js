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
import { nodeStats } from 'reducers/nodeStats.reducer';

export default combineReducers({
  algorithmBuildsTable,
  algorithmReadme,
  algorithmTable,
  autoCompleteFilter,
  debugTable,
  driverTable,
  jobsJaeger,
  jobsKubernetesLogs,
  jobsTable,
  nodeStats,
  pipelineReadme,
  pipelineTable,
  workerTable
});
