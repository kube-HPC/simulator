import React from 'react';

import JsonView from 'components/common/json/JsonView.react';
import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import CardRow from 'components/common/CardRow.react';

import useErrorLogs from 'hooks/useErrorLogs.react';
import errorLogsTableColumns from 'components/UI/Layout/SidebarOperations/ErrorLogs/ErrorLogsTableColumns.react';

export default function ErrorLogsTable() {
  const { dataSource } = useErrorLogs();

  return (
    <DynamicTable
      isInner
      rowKey={({ timestamp, message }) => `${timestamp}-${message}`}
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
