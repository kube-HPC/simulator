import React, { useEffect } from 'react';

import { useErrorLogs } from 'hooks';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import errorLogsTableColumns from './ErrorLogsTableColumns.react';

const expandedRowRender = record => (
  <Card>
    <JsonSwitch obj={record} />
  </Card>
);

const extractId = ({ id }) => id;

const ErrorLogsTable = () => {
  const { dataSource, clearCounter } = useErrorLogs();

  useEffect(() => {
    clearCounter();
  }, [clearCounter]);

  return (
    <Table
      rowKey={extractId}
      columns={errorLogsTableColumns}
      dataSource={dataSource}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default React.memo(ErrorLogsTable);
