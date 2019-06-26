import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { Tabs, Card } from 'antd';

import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import defaultWorkerData from 'config/template/worker.template';
import {
  workerTableColumns,
  workersTableStats
} from 'components/UI/tables/Workers/WorkersTableColumns.react';
import JsonView from 'components/common/json/JsonView.react';
import CardRow from 'components/common/CardRow.react';

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <Card size="small">
      <JsonView jsonObject={value} />
    </Card>
  </Tabs.TabPane>
);

const expandedRowRender = (columns, dataSource) => record => {
  const filteredDataSource = dataSource.filter(
    d => d.algorithmName === record.algorithmName
  );

  return (
    <CardRow>
      <DynamicTable
        rowKey={record => record.podName}
        columns={columns}
        dataSource={filteredDataSource}
        expandedRowRender={record => {
          const timer = {
            workerStartingTime:
              record.data &&
              record.data.workerStartingTime &&
              new Date(record.data.workerStartingTime).toLocaleString(),
            jobCurrentTime:
              record.data &&
              record.data.jobCurrentTime &&
              new Date(record.data.jobCurrentTime).toLocaleString()
          };

          return (
            <CardRow>
              <Tabs defaultActiveKey="1">
                {generateTab('JSON', record)}
                {generateTab('Additional Details', timer)}
              </Tabs>
            </CardRow>
          );
        }}
      />
    </CardRow>
  );
};

const tableDataSelector = createSelector(
  state => state.workerTable.dataSource,
  dataSource => dataSource
);

function WorkersTable() {
  const dataSource = useSelector(tableDataSelector);
  const stats = useSelector(state => state.workerTable.stats);

  const statsMergedWithDefault =
    stats &&
    stats.stats &&
    stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }));
  return (
    <DynamicTable
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
