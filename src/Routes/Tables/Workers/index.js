import React, { useMemo } from 'react';
import { Table } from 'components';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Card, JsonSwitch, Tabs } from 'components/common';
import defaultWorkerData from 'config/template/worker.template';
import { useWorkers } from 'hooks/graphql';
import { workersStopListVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import { workersColumns, workersTableStats } from './columns';

const generateTab = (key, value) => [
  {
    label: key,
    key,
    children: (
      <Card>
        <JsonSwitch obj={value} />
      </Card>
    ),
  },
];

const ExpandedRow = (collection, arrWorkersStopList) => recordRow => {
  const entries = collection[recordRow?.algorithmName] || [];

  return (
    <Card isMargin>
      <Table
        rowClassName={
          arrWorkersStopList?.includes(recordRow?.algorithmName)
            ? 'expanded-row-disable'
            : ''
        }
        isInner
        rowKey={row => row.podName}
        columns={workersTableStats}
        dataSource={entries}
        expandable={{
          expandedRowRender: row => (
            <Card isMargin>
              <Tabs items={generateTab('Information', row)} />
            </Card>
          ),

          // eslint-disable-next-line react/prop-types
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <RightOutlined onClick={e => onExpand(record, e)} />
            ),
        }}
      />
    </Card>
  );
};

const WorkersTable = () => {
  const workersStopList = useReactiveVar(workersStopListVar);
  const { collection, stats } = useWorkers();
  const statsMergedWithDefault = useMemo(
    () =>
      stats?.stats?.map(algorithm => ({
        ...defaultWorkerData,
        ...algorithm,
      })) ?? [],
    [stats]
  );

  return (
    <Table
      rowKey={record => record.algorithmName}
      columns={workersColumns}
      dataSource={statsMergedWithDefault}
      expandable={{
        expandedRowRender: ExpandedRow(collection, workersStopList),
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

WorkersTable.propTypes = {};

export default WorkersTable;
