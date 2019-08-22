import { createSelector } from 'reselect';

export const tableDataSelector = (table, predicate) =>
  createSelector(
    state => state[table].dataSource,
    state => state.autoCompleteFilter.filter,
    (dataSource, filter) => dataSource && dataSource.filter(predicate(filter))
  );
