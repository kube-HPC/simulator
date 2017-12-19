import { combineReducers } from 'redux';
import layers from './layers.reducer';
import containerTable from './conatainerTable.reducer';
import workerTable from './workerTable.reducer';
import modal from './modal.reducer';
import ui from './ui.reducer';
import terminal from './terminal.reducer';
import autoCompleteFilter from './autoCompleteFilter.reducer';
import serverSelection from './serverSelection.reducer';

const rootReducer = combineReducers({
  ui,
  layers,
  containerTable,
  workerTable,
  modal,
  terminal,
  autoCompleteFilter,
  serverSelection
});
export default rootReducer;

