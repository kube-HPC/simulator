import React, { useMemo } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table } from 'components';
import { Card, JsonSwitch, Tabs } from 'components/common';
import defaultWorkerData from 'config/template/worker.template';
import { selectors } from 'reducers';
import {
  getWorkersColumns,
  workersTableStats,
} from './getWorkersColumns.react';

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <Card>
      <JsonSwitch obj={value} />
    </Card>
  </Tabs.TabPane>
);

const expandedRowRender = columns => record => {
  const collection = useSelector(selectors.workers.all);

  const filteredDataSource = useMemo(
    () => collection.filter(d => d.algorithmName === record.algorithmName),
    [collection, record]
  );

  return (
    <Card isMargin>
      <Table
        isInner
        rowKey={row => row.podName}
        columns={columns}
        dataSource={filteredDataSource}
        expandedRowRender={row => (
          <Card isMargin>
            <Tabs>{generateTab('Information', row)}</Tabs>
          </Card>
        )}
      />
    </Card>
  );
};

function WorkersTable() {
  const stats = useSelector(selectors.workers.stats);

  const statsMergedWithDefault =
    (stats &&
      stats.stats &&
      stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }))) ||
    [];

  return (
    <Table
      rowKey={record => record.algorithmName}
      columns={getWorkersColumns()}
      dataSource={statsMergedWithDefault}
      expandedRowRender={expandedRowRender(workersTableStats())}
    />
  );
}

WorkersTable.propTypes = {
  // dataSource: PropTypes.array.isRequired,
  // stats: PropTypes.object.isRequired,
};

export default WorkersTable;
