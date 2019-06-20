import { handleActions } from 'redux-actions';
import dateformat from 'dateformat';
import Immutable from 'seamless-immutable';
import actions from 'constants/actions';

export const jobsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](
      state,
      { type, payload, meta, error }
    ) {
      const timedData = payload.jobs.map(d => {
        if (d.status) {
          d.status.timestamp = dateformat(
            d.status.timestamp,
            'd/mm/yy, HH:MM:ss'
          );
        }
        return d;
      });
      return state.merge({ dataSource: timedData });
    }
  },
  Immutable.from({ dataSource: [] })
);

export const jobsJaeger = handleActions(
  {
    [actions.JOBS_JAEGER_SUCCESS](state, { type, payload, meta, error }) {
      return state.setIn([Object.keys(payload)[0]], payload);
    }
  },
  Immutable.from({})
);

export const jobsKubernetesLogs = handleActions(
  {
    [actions.JOBS_KUBERNETES_LOGS_SUCCESS](state, { payload }) {
      return state.merge({ dataSource: payload });
    }
  },
  Immutable.from({ dataSource: [] })
);
