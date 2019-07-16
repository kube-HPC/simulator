import React from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import { deleteAlgorithm } from 'actions/debug.action';

import debugTableColumns from 'components/UI/tables/Debug/DebugTableColumns.react';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import JsonView from 'components/common/json/JsonView.react';
import CardRow from 'components/common/CardRow.react';

const tableDataSelector = createSelector(
  state => state.debugTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.name.includes(filter))
);

function DebugTable() {
  const dataSource = useSelector(state => tableDataSelector(state));

  const dispatch = useDispatch();

  const onDelete = data => dispatch(deleteAlgorithm(data));

  return (
    <DynamicTable
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
