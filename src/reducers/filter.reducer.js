import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';
import { getLsObjectItem } from 'utils';
import { LOCAL_STORAGE_KEYS } from 'const';

const initialValue = Immutable.from(getLsObjectItem(LOCAL_STORAGE_KEYS.FILTER_TYPES) || []);

export const filterByType = handleActions(
  {
    [actions.FILTER_TYPES](currState, { types }) {
      return Immutable.merge(types);
    },
  },
  initialValue,
);
