import actions from 'constants/application-actions';

export const nextStep = () => ({
  type: actions.USER_GUIDE_NEXT_STEP
});

export const triggerUserGuide = () => ({
  type: actions.USER_GUIDE_TRIGGER
});
