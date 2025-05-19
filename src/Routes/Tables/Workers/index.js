import React, { useMemo } from 'react';
import { Table } from 'components';
import { Table as TableSum } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Card, JsonSwitch, Tabs } from 'components/common';
import defaultWorkerData from 'config/template/worker.template';
import { useWorkers } from 'hooks/graphql';
import { workersColumns, workersTableStats } from './columns';
import WorkersActions from './WorkersActions.react';

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

const expandedRowRender = row => (
  <Card isMargin>
    <Tabs items={generateTab('Information', row)} />
  </Card>
);

const expandIcon = ({ expanded, onExpand, record }) =>
  expanded ? (
    <DownOutlined onClick={e => onExpand(record, e)} />
  ) : (
    <RightOutlined onClick={e => onExpand(record, e)} />
  );

const renderSummary = pageData => {
  let totalReadyCount = 0;
  let totalWorkingCount = 0;
  let totalInitCount = 0;
  let totalExitCount = 0;
  let totalHotCount = 0;
  let totalCount = 0;
  const algorithmNames = [];

  pageData.forEach(
    ({ ready, working, init, exit, hot, count, algorithmName }) => {
      totalReadyCount += ready;
      totalWorkingCount += working;
      totalInitCount += init;
      totalExitCount += exit;
      totalHotCount += hot;
      totalCount += count;
      algorithmNames.push(algorithmName);
    }
  );

  return (
    <TableSum.Summary fixed>
      <TableSum.Summary.Row>
        <TableSum.Summary.Cell>{` `}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{` `}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalReadyCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalWorkingCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalInitCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalExitCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalHotCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>{totalCount}</TableSum.Summary.Cell>
        <TableSum.Summary.Cell>
          <WorkersActions stopAllWorkers={algorithmNames} />
        </TableSum.Summary.Cell>
      </TableSum.Summary.Row>
    </TableSum.Summary>
  );
};

const ExpandedRow = collection => recordRow => {
  const entries = collection[recordRow?.algorithmName] || [];
  return (
    <Card isMargin>
      <Table
        rowClassName={row => (row?.workerPaused ? 'expanded-row-disable' : '')}
        isInner
        rowKey={row => row.podName}
        columns={workersTableStats}
        dataSource={entries}
        expandable={{
          expandedRowRender,
          expandIcon,
        }}
      />
    </Card>
  );
};

const WorkersTable = () => {
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
        expandedRowRender: ExpandedRow(collection),
        expandIcon,
      }}
      summary={renderSummary}
    />
  );
};

WorkersTable.propTypes = {};

export default WorkersTable;
