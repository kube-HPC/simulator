import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

export const nodeStatistics = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](currState, { payload: nodeStatistics }) {
      const validPayload = Array.isArray(nodeStatistics);
      return validPayload ? Immutable.set(currState, 'dataSource', nodeStatistics) : currState;
    }
  },
  Immutable.from({ dataSource: [] })
);
