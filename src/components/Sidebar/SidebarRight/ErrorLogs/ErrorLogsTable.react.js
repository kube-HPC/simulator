import React from 'react';

import JsonView from 'components/common/Json/JsonView.react';
import Table from 'components/Table/Table.react';
import Card from 'components/common/Card.react';

import errorLogsTableColumns from 'components/Sidebar/SidebarRight/ErrorLogs/ErrorLogsTableColumns.react';
import { useErrorLogs } from 'hooks';

export default function ErrorLogsTable() {
  const { dataSource } = useErrorLogs();

  return (
    <Table
      isInner
      rowKey={({ id }) => id}
      columns={errorLogsTableColumns()}
      dataSource={dataSource}
      expandedRowRender={record => (
        <Card>
          <JsonView jsonObject={record} collapsed="1" />
        </Card>
      )}
    />
  );
}
