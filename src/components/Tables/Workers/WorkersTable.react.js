import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table } from 'components';
import { Card, JsonSwitch, Tabs } from 'components/common';
import {
  getWorkersColumns,
  workersTableStats,
} from 'components/Tables/Workers/getWorkersColumns.react';
import defaultWorkerData from 'config/template/worker.template';
import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/tableSelector';

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <Card>
      <JsonSwitch obj={value} />
    </Card>
  </Tabs.TabPane>
);

const expandedRowRender = (columns, dataSource) => record => {
  const filteredDataSource = dataSource.filter(
    d => d.algorithmName === record.algorithmName
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

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.WORKERS);

function WorkersTable() {
  const dataSource = useSelector(dataSelector);
  const stats = useSelector(state => state.workerTable.stats);

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
      expandedRowRender={expandedRowRender(workersTableStats(), dataSource)}
    />
  );
}

WorkersTable.propTypes = {
  // dataSource: PropTypes.array.isRequired,
  // stats: PropTypes.object.isRequired,
};

export default WorkersTable;
