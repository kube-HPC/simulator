import React from 'react';

import { useErrorLogs } from 'hooks';
import { Table } from 'components';
import { Card, JsonView } from 'components/common';
import errorLogsTableColumns from './ErrorLogsTableColumns.react';

const ErrorLogsTable = () => {
  const { dataSource } = useErrorLogs();

  const expandedRowRender = record => (
    <Card isMargin>
      <JsonView jsonObject={record} collapsed="1" />
    </Card>
  );

  return (
    <Table
      isInner
      rowKey={({ id }) => id}
      columns={errorLogsTableColumns()}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(ErrorLogsTable);
