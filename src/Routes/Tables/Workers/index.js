import React, { useMemo } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table } from 'components';
import { Card, JsonSwitch, Tabs } from 'components/common';
import defaultWorkerData from 'config/template/worker.template';
import { selectors } from 'reducers';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { workersColumns, workersTableStats } from './columns';

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <Card>
      <JsonSwitch obj={value} />
    </Card>
  </Tabs.TabPane>
);

const expandedRowRender = row => (
  <Card isMargin>
    <Tabs>{generateTab('Information', row)}</Tabs>
  </Card>
);

const ExpandedRow = collection => record => {
  const entries = collection[record?.algorithmName] || [];
  return (
    <Card isMargin>
      <Table
        isInner
        rowKey={row => row.podName}
        columns={workersTableStats}
        dataSource={entries}
        expandable={{
          expandedRowRender,
          // eslint-disable-next-line react/prop-types
          expandIcon: ({ expanded, onExpand, row }) =>
            expanded ? (
              <DownOutlined onClick={e => onExpand(row, e)} />
            ) : (
              <RightOutlined onClick={e => onExpand(row, e)} />
            ),
        }}
      />
    </Card>
  );
};

const WorkersTable = () => {
  const stats = useSelector(selectors.workers.stats);
  const collection = useSelector(selectors.workers.all);

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
      expandedRowRender={ExpandedRow(collection)}
    />
  );
};

WorkersTable.propTypes = {};

export default WorkersTable;
