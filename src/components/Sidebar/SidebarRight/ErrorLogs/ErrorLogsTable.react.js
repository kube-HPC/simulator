import React from 'react';

import JsonView from 'components/common/json/JsonView.react';
import Table from 'components/Table/Table.react';
import CardRow from 'components/common/CardRow.react';

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
        <CardRow>
          <JsonView jsonObject={record} collapsed="1" />
        </CardRow>
      )}
    />
  );
}
