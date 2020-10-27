import React from 'react';

import { useErrorLogs } from 'hooks';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import errorLogsTableColumns from './ErrorLogsTableColumns.react';

const ErrorLogsTable = () => {
  const { dataSource } = useErrorLogs();

  const expandedRowRender = record => (
    <Card>
      <JsonSwitch obj={record} />
    </Card>
  );

  return (
    <Table
      rowKey={({ id }) => id}
      columns={errorLogsTableColumns()}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(ErrorLogsTable);