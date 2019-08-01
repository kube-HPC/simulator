import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import { getBooleanLocalStorageItem } from 'utils/localStorage';

const isOn = getBooleanLocalStorageItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS);

const userGuideStatus = Immutable.from({
  stepIndex: 0,
  isOn
});

export const userGuide = handleActions(
  {
    [actions.USER_GUIDE_CHANGE_STEP](state, { payload }) {
      console.log(payload);
      return state.merge({
        stepIndex: payload
      });
    },
    [actions.USER_GUIDE_TRIGGER](state) {
      return state.merge({
        stepIndex: 0,
        isOn: !state.isOn
      });
    }
  },
  Immutable.from(userGuideStatus)
);
