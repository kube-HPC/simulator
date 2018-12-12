import actions from '../constants/actions';

export const updateFilter = (filter) => ({
  type: actions.UPDATE_FILTER,
  payload: { filter }
});
