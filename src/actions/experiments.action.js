import actions from 'const/application-actions';

export const experimentChange = value => ({
  type: actions.EXPERIMENT_CHANGE,
  value,
});

export const triggerLoading = () => ({
  type: actions.EXPERIMENT_TRIGGER_LOADING,
});
