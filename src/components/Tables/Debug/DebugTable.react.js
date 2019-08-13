import React from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import { deleteAlgorithm } from 'actions/debug.action';

import debugTableColumns from 'components/Tables/Debug/DebugTableColumns.react';
import Table from 'components/Table/Table.react';
import JsonView from 'components/common/json/JsonView.react';
import CardRow from 'components/common/CardRow.react';

const tableDataSelector = createSelector(
  state => state.debugTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(algorithm => algorithm.name.includes(filter))
);

function DebugTable() {
  const dataSource = useSelector(tableDataSelector);

  const dispatch = useDispatch();

  const onDelete = data => dispatch(deleteAlgorithm(data));

  return (
    <Table
      rowKey={record => record.name}
      columns={debugTableColumns({ onDelete })}
      dataSource={dataSource}
      expandedRowRender={record => (
        <CardRow>
          <JsonView jsonObject={record} />
        </CardRow>
      )}
    />
  );
}

export default DebugTable;
