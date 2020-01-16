import actions from 'const/application-actions';

export const setSettings = payload => ({
  type: actions.UPDATE_SETTINGS,
  payload,
});
