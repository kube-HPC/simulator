import { experimentsSchema } from 'config';
import { LOCAL_STORAGE_KEYS } from 'const';
import actions from 'const/application-actions';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getLsItem } from 'utils';

const initial = Immutable.from({
  dataSource: [],
  value: getLsItem(LOCAL_STORAGE_KEYS.EXPERIMENT) || experimentsSchema.default,
  lastValue: null,
  loading: true,
});

export const experiments = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload: { experiments } }) {
      return Immutable.merge(currState, { dataSource: experiments });
    },
    [actions.EXPERIMENT_CHANGE](currState, { value }) {
      const { value: lastValue } = currState;
      return Immutable.merge(currState, { value, lastValue, loading: true });
    },
    [actions.EXPERIMENT_TRIGGER_LOADING](currState) {
      const { loading } = currState;
      return Immutable.set(currState, `loading`, !loading);
    },
  },
  initial,
);
