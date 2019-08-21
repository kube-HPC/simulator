import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table.react';
import defaultWorkerData from 'config/template/worker.template';
import {
  workerTableColumns,
  workersTableStats
} from 'components/Tables/Workers/WorkersTableColumns.react';
import { createSelector } from 'reselect';
import { Tabs, Card, JsonView } from 'components/common';

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
    <Card>
      <Table
        isInner
        rowKey={record => record.podName}
        columns={columns}
        dataSource={filteredDataSource}
        expandedRowRender={record => (
          <Card>
            <Tabs>{generateTab('JSON', record)}</Tabs>
          </Card>
        )}
      />
    </Card>
  );
};

const tableDataSelector = createSelector(
  state => state.workerTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(algorithm => algorithm.algorithmName.includes(filter))
);

function WorkersTable() {
  const dataSource = useSelector(tableDataSelector);
  const stats = useSelector(state => state.workerTable.stats);

  const statsMergedWithDefault =
    (stats &&
      stats.stats &&
      stats.stats.map(algo => ({ ...defaultWorkerData, ...algo })).asMutable()) ||
    [];
  return (
    <Table
      rowKey={record => record.algorithmName}
      columns={workerTableColumns()}
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
