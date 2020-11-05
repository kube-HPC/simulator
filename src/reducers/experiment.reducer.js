import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';

const initial = Immutable.from({
  dataSource: [],
  loading: true,
});

export const experiments = handleActions(
  {
    [actions.SOCKET_GET_DATA](
      currState,
      { payload: { experiments: nextExperiments } }
    ) {
      return Immutable.merge(currState, {
        dataSource: nextExperiments,
      });
    },
    [actions.EXPERIMENT_TRIGGER_LOADING](currState) {
      const { loading } = currState;
      return Immutable.set(currState, `loading`, !loading);
    },
  },
  initial
);
