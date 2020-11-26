import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAlgorithm } from 'actions/debug.action';
import { Table } from 'components';
import { Card, JsonView } from 'components/common';
import { selectors } from 'reducers';
import { useFilter } from 'hooks/useSearch';
import debugTableColumns from './DebugTableColumns.react';

const DebugTable = () => {
  const collection = useSelector(selectors.debug.all);
  const filtered = useFilter(collection, 'name');
  const dispatch = useDispatch();
  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [
    dispatch,
  ]);

  const expandedRowRender = record => (
    <Card isMargin>
      <JsonView jsonObject={record} />
    </Card>
  );

  return (
    <Table
      rowKey={({ name }) => name}
      columns={debugTableColumns({ onDelete })}
      dataSource={filtered}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(DebugTable);
