import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';

const DEFAULT_VALUE = [];
const initialValue = Immutable.from({ dataSource: DEFAULT_VALUE });

export const jobsTable = handleActions(
  {
    [actions.LAYOUT_UPDATE_ROW_DATA_TABLE](currJobs, { payload, error }) {
      const { jobs } = payload;
      return Immutable.from({ dataSource: jobs || DEFAULT_VALUE });
    }
  },
  initialValue
);

export const jobsJaeger = handleActions(
  {
    [actions.JOBS_JAEGER_SUCCESS](state, { payload }) {
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
  initialValue
);
