import actions from 'const/application-actions';

export const filterByType = payload => ({
  type: actions.FILTER_TYPES,
  payload,
});
