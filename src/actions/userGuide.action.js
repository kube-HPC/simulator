import actions from 'constants/application-actions';

export const changeStep = step => ({
  type: actions.USER_GUIDE_CHANGE_STEP,
  payload: step
});

export const triggerUserGuide = () => ({
  type: actions.USER_GUIDE_TRIGGER
});
