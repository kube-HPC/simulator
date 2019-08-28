import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteAlgorithm } from 'actions/debug.action';
import { Table } from 'components';
import debugTableColumns from './DebugTableColumns.react';
import { Card, JsonView } from 'components/common';
import { tableFilterSelector } from 'utils/tableSelector';
import { LEFT_SIDEBAR_NAMES } from 'const';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.DEBUG);

const DebugTable = () => {
  const dataSource = useSelector(dataSelector);

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
