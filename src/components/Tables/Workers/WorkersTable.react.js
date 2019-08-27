import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import defaultWorkerData from 'config/template/worker.template';
import {
  getWorkersColumns,
  workersTableStats
} from 'components/Tables/Workers/getWorkersColumns.react';

import { Tabs, Card, JsonView } from 'components/common';
import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/hooks';
import { Table } from 'components';

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <Card>
      <JsonView jsonObject={value} />
    </Card>
  </Tabs.TabPane>
);

const expandedRowRender = (columns, dataSource) => record => {
  const filteredDataSource = dataSource.filter(d => d.algorithmName === record.algorithmName);

  return (
    <Card isMargin>
      <Table
        isInner
        rowKey={record => record.podName}
        columns={columns}
        dataSource={filteredDataSource}
        expandedRowRender={record => (
          <Card isMargin>
            <Tabs>{generateTab('JSON', record)}</Tabs>
          </Card>
        )}
      />
    </Card>
  );
};

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.WORKERS);

function WorkersTable() {
  const dataSource = useSelector(dataSelector);
  const stats = useSelector(state => state.workerTable.stats);

  const statsMergedWithDefault =
    (stats && stats.stats && stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }))) || [];

  return (
    <Table
      rowKey={record => record.algorithmName}
      columns={getWorkersColumns()}
      dataSource={statsMergedWithDefault}
      expandedRowRender={expandedRowRender(workersTableStats(), dataSource)}
    />
  );
}

WorkersTable.propTypes = {
  dataSource: PropTypes.array,
  stats: PropTypes.object
};

export default WorkersTable;
