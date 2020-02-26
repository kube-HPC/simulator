import actions from 'const/application-actions';

export const experimentChange = selected => ({
  type: actions.EXPERIMENT_CHANGE,
  selected,
});
