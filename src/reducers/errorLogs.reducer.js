import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

const errorLogsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](
      state,
      { type, payload, meta, error }
    ) {
      return state.merge({
        dataSource: payload.logs || []
      });
    }
  },
  Immutable.from({ dataSource: [] })
);

export default errorLogsTable;
