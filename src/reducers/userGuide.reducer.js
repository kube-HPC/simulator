import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from 'constants/application-actions';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';
import { getBooleanLSItem, getLSItem } from 'utils/localStorage';

// When LS not available, show tutorial.
const isOn = getLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  ? getBooleanLSItem(LOCAL_STORAGE_KEYS.USER_GUIDE_STATUS)
  : true;

const userGuideInitialStatus = Immutable.from({
  stepIndex: 0,
  isOn
});

const userGuide = handleActions(
  {
    [actions.USER_GUIDE_CHANGE_STEP](userGuide, { payload }) {
      return Immutable.set(userGuide, 'stepIndex', payload);
    },
    [actions.USER_GUIDE_TRIGGER](userGuide) {
      return Immutable.set(userGuideInitialStatus, 'isOn', !userGuide.isOn);
    }
  },
  userGuideInitialStatus
);

export default userGuide;
