import actions from 'const/application-actions';

export const filterByType = types => ({
  type: actions.FILTER_TYPES,
  types,
});
