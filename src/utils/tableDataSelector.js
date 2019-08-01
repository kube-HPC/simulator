import { createSelector } from 'reselect';

const tableDataSelector = (table, predicate) =>
  createSelector(
    state => state[table].dataSource.asMutable(),
    state => state.autoCompleteFilter.filter,
    (dataSource, filter) => dataSource && dataSource.filter(predicate(filter))
  );

export default tableDataSelector;
