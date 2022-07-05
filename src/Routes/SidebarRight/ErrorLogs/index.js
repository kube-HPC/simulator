import React, { useEffect } from 'react';

// import { useErrorLogs } from 'hooks';
import { useErrorLogs } from 'hooks/graphql';
import { Table } from 'components';
import { JsonSwitch, Card } from 'components/common';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
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
      expandable={{
        expandedRowRender,
        // eslint-disable-next-line react/prop-types
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          ),
      }}
    />
  );
};

export default React.memo(ErrorLogsTable);
