import { experimentsTemplate } from 'config';
import { LOCAL_STORAGE_KEYS } from 'const';
import actions from 'const/application-actions';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { getLsItem } from 'utils';

const initial = Immutable.from({
  dataSource: [],
  selected: getLsItem(LOCAL_STORAGE_KEYS.EXPERIMENT) || experimentsTemplate.default,
});

export const experiments = handleActions(
  {
    [actions.SOCKET_GET_DATA](currState, { payload: { experiments } }) {
      return Immutable.merge(currState, { dataSource: experiments });
    },
    [actions.EXPERIMENT_CHANGE](currState, { selected }) {
      return Immutable.merge(currState, { selected });
    },
  },
  initial,
);
