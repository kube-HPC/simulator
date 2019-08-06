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
      rowKey={({ type, podName, timestamp, message }) =>
        `${type}-${podName}-${timestamp}-${message}`
      }
      columns={errorLogsTableColumns()}
      dataSource={dataSource}
      pagination={{ pageSize: 13 }}
      expandedRowRender={record => (
        <CardRow>
          <JsonView jsonObject={record} collapsed="1" />
        </CardRow>
      )}
    />
  );
}
