import { tableSelector } from 'utils';

const getDataByTable = table => state => {
  if (!tableSelector[table]) {
    return [];
  }
  const { sourceName, mapFunc } = tableSelector[table];
  const currTableState = state[sourceName];
  return currTableState ? currTableState.dataSource.map(mapFunc) : [];
};

export default getDataByTable;
