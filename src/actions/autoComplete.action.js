import actions from 'constants/application-actions';

export const autoCompleteFilter = filter => ({
  type: actions.AUTO_COMPLETE_UPDATE_FILTER,
  payload: { filter }
});
