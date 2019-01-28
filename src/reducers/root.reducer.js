import { combineReducers } from 'redux';
import layers from './layers.reducer';
import containerTable from './conatainerTable.reducer';
import workerTable from './workerTable.reducer';
import driverTable from './driverTable.reducer';
import debugTable from './debugTable.reducer';
import algorithmTable from './algorithmTable.reducer';
import modal from './modal.reducer';
import sideBar from './sideBar.reducer';
import ui from './ui.reducer';
import autoCompleteFilter from './autoCompleteFilter.reducer';
import serverSelection from './serverSelection.reducer';
import storedPipeline from './storedPipeline.reducer';
import jaeger from './jaegerData.reducer';
import kubernetesLogs from './kubernetesLogs.reducer';
import nodeStatistics from './nodeStatistics.reducer';
const rootReducer = combineReducers({
  ui,
  layers,
  containerTable,
  workerTable,
  driverTable,
  algorithmTable,
  debugTable,
  modal,
  sideBar,
  autoCompleteFilter,
  serverSelection,
  storedPipeline,
  jaeger,
  kubernetesLogs,
  nodeStatistics
});
export default rootReducer;

