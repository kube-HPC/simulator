import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';
import transformTraceData from 'utils/jaeger/transformTraceData';

export const jobsTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](currJobs, { payload }) {
      const { jobs } = payload;
      return Immutable.from({ dataSource: jobs });
    }
  },
  Immutable.from({ dataSource: undefined })
);

export const jobsJaeger = handleActions(
  {
    [actions.JOBS_JAEGER_SUCCESS](state, { payload }) {
      const jaeger = (payload && payload.data && payload.data[0]) || {};
      return state.merge({ dataSource: transformTraceData(jaeger) });
    }
  },
  Immutable.from({ dataSource: {} })
);

export const jobsKubernetesLogs = handleActions(
  {
    [actions.JOBS_KUBERNETES_LOGS_SUCCESS](state, { payload }) {
      return state.merge({ dataSource: payload });
    }
  },
  Immutable.from({ dataSource: [] })
);
