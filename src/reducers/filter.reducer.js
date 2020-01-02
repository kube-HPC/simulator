import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';
import { getLsObjectItem } from 'utils';
import { LOCAL_STORAGE_KEYS } from 'const';
import { pipelineTypes } from '@hkube/consts';

const DEFAULT_TYPES = Object.values(pipelineTypes);

const initialValue = Immutable(getLsObjectItem(LOCAL_STORAGE_KEYS.FILTER_TYPES) || DEFAULT_TYPES);

export const filterByType = handleActions(
  {
    [actions.FILTER_TYPES](state, { payload }) {
      return Immutable(payload);
    },
  },
  initialValue,
);
