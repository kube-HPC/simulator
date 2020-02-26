import { experimentsTemplate } from 'config';
import { LOCAL_STORAGE_KEYS } from 'const';
import actions from 'const/application-actions';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getLsItem } from 'utils';

const initial = Immutable.from({
  dataSource: [],
  value: getLsItem(LOCAL_STORAGE_KEYS.EXPERIMENT) || experimentsTemplate.default,
  lastValue: null,
});

export const experiments = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload: { experiments } }) {
      return Immutable.merge(currState, { dataSource: experiments });
    },
    [actions.EXPERIMENT_CHANGE](currState, { value }) {
      const { value: lastValue } = currState;
      return Immutable.merge(currState, { value, lastValue });
    },
  },
  initial,
);
