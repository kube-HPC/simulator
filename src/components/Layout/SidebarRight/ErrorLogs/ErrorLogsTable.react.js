import React from 'react';

import JsonView from 'components/common/json/JsonView.react';
import DynamicTable from 'components/Layout/DynamicTable.react';
import CardRow from 'components/common/CardRow.react';

import useErrorLogs from 'hooks/useErrorLogs.react';
import errorLogsTableColumns from 'components/Layout/SidebarRight/ErrorLogs/ErrorLogsTableColumns.react';

export default function ErrorLogsTable() {
  const { dataSource } = useErrorLogs();

  return (
    <DynamicTable
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
