import React, { useCallback } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import { deleteAlgorithm } from 'actions/debug.action';
import { Table } from 'components';
import debugTableColumns from './DebugTableColumns.react';
import { Card, JsonView } from 'components/common';

const tableDataSelector = createSelector(
  state => state.debugTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(algorithm => algorithm.name.includes(filter))
);

const DebugTable = () => {
  const dataSource = useSelector(tableDataSelector);

  const dispatch = useDispatch();
  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [dispatch]);

  const expandedRowRender = record => (
    <Card isMargin>
      <JsonView jsonObject={record} />
    </Card>
  );

  return (
    <Table
      rowKey={({ name }) => name}
      columns={debugTableColumns({ onDelete })}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(DebugTable);
