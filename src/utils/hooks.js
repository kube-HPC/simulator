import { createSelector } from 'reselect';

export const makeToggle = setter => () => setter(prev => !prev);

export const tableDataSelector = (table, predicate) =>
  createSelector(
    state => state[table].dataSource.asMutable(),
    state => state.autoCompleteFilter.filter,
    (dataSource, filter) => dataSource && dataSource.filter(predicate(filter))
  );
