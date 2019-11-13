import actions from 'const/application-actions';

export const changeStep = step => ({
  type: actions.USER_GUIDE_CHANGE_STEP,
  stepIndex: step,
});

export const triggerUserGuide = () => ({
  type: actions.USER_GUIDE_TRIGGER,
});
