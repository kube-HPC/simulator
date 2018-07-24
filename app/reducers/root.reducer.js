import { combineReducers } from 'redux';
import layers from './layers.reducer';
import containerTable from './conatainerTable.reducer';
import workerTable from './workerTable.reducer';
import driverTable from './driverTable.reducer';
import algorithmTable from './algorithmTable.reducer';
import modal from './modal.reducer';
import ui from './ui.reducer';
import autoCompleteFilter from './autoCompleteFilter.reducer';
import serverSelection from './serverSelection.reducer';

const rootReducer = combineReducers({
  ui,
  layers,
  containerTable,
  workerTable,
  driverTable,
  algorithmTable,
  modal,
  autoCompleteFilter,
  serverSelection
});
export default rootReducer;

