import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'const/application-actions';
import LOCAL_STORAGE_KEYS from 'const/local-storage';
import { getBooleanLSItem, getLsItem } from 'utils/localStorage';

// When LS not available, show tutorial.
const isOn = getLsItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  ? getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  : true;

const userGuideInitialStatus = Immutable.from({
  stepIndex: 0,
  isOn,
});

export const userGuide = handleActions(
  {
    [actions.USER_GUIDE_CHANGE_STEP](userGuide, { stepIndex }) {
      return Immutable.set(userGuide, `stepIndex`, stepIndex);
    },
    [actions.USER_GUIDE_TRIGGER](userGuide) {
      return Immutable.set(userGuideInitialStatus, `isOn`, !userGuide.isOn);
    },
  },
  userGuideInitialStatus,
);
