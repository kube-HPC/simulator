import { combineReducers } from 'redux';
import containerTable from 'reducers/containerTable.reducer';
import workerTable from 'reducers/workerTable.reducer';
import driverTable from 'reducers/driverTable.reducer';
import debugTable from 'reducers/debugTable.reducer';
import algorithmTable from 'reducers/algorithmTable.reducer';
import algorithmBuildsTable from 'reducers/algorithmBuildsTable.reducer';
import modal from 'reducers/modal.reducer';
import sideBar from 'reducers/sideBar.reducer';
import ui from 'reducers/ui.reducer';
import autoCompleteFilter from 'reducers/autoCompleteFilter.reducer';
import serverSelection from 'reducers/serverSelection.reducer';
import storedPipeline from 'reducers/storedPipeline.reducer';
import jaeger from 'reducers/jaegerData.reducer';
import kubernetesLogs from 'reducers/kubernetesLogs.reducer';
import nodeStatistics from 'reducers/nodeStatistics.reducer';
import pipelineReadme from 'reducers/pipelineReadme.reducer';
import algorithmReadme from 'reducers/algorithmReadme.reducer';

const rootReducer = combineReducers({
  ui,
  containerTable,
  workerTable,
  driverTable,
  algorithmTable,
  algorithmBuildsTable,
  debugTable,
  modal,
  sideBar,
  autoCompleteFilter,
  serverSelection,
  storedPipeline,
  jaeger,
  kubernetesLogs,
  nodeStatistics,
  pipelineReadme,
  algorithmReadme
});
export default rootReducer;
