import React from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import { deleteAlgorithm } from 'actions/debug.action';

import debugTableColumns from 'components/UI/tables/Debug/DebugTableColumns.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import JsonView from 'components/containers/json/JsonView.react';
import RowCard from 'components/containers/RowCard.react';

const tableDataSelector = createSelector(
  state => state.debugTable.dataSource,
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.name.includes(filter))
);

function DebugTable() {
  const dataSource = useSelector(state => tableDataSelector(state));

  const dispatch = useDispatch();

  const onDelete = data => dispatch(deleteAlgorithm(data));

  return (
    <InfinityTable
      rowKey={record => record.name}
      columns={debugTableColumns({ onDelete })}
      dataSource={dataSource}
      expandedRowRender={record => (
        <RowCard>
          <JsonView jsonObject={record} />
        </RowCard>
      )}
    />
  );
}

export default DebugTable;
