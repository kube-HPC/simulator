import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

export const jobsTable = handleActions(
  {
    [actions.SOCKET_GET_DATA](currJobs, { payload }) {
      const { jobs } = payload;
      return Immutable.from({ dataSource: jobs });
    },
  },
  Immutable.from({ dataSource: undefined }),
);

export const jobsKubernetesLogs = handleActions(
  {
    [actions.JOBS_KUBERNETES_LOGS_SUCCESS](state, { payload }) {
      return state.merge({ dataSource: payload });
    },
  },
  Immutable.from({ dataSource: [] }),
);
