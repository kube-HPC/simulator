import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

const initialValue = { dataSource: [] };

const errorLogsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](currState, { payload }) {
      // const isValidPayload = payload.logs;
      // return isValidPayload ? Immutable.set(currState, 'dataSource', payload.logs) : currState;
      currState.dataSource = payload.logs;
      return currState;
    }
  },
  // Immutable.from({ dataSource: [] })
  initialValue
);

export default errorLogsTable;
