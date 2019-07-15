import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

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
    <CardRow>
      <JsonView jsonObject={value} />
    </CardRow>
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
        expandedRowRender={record => (
          <CardRow>
            <Tabs>{generateTab('JSON', record)}</Tabs>
          </CardRow>
        )}
      />
    </CardRow>
  );
};

function WorkersTable() {
  const dataSource = useSelector(state =>
    state.workerTable.dataSource.asMutable()
  );
  const stats = useSelector(state => state.workerTable.stats);

  const statsMergedWithDefault =
    stats &&
    stats.stats &&
    stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }));
  return (
    <DynamicTable
      rowKey={record => record.algorithmName}
      columns={workerTableColumns()}
      dataSource={statsMergedWithDefault.asMutable()}
      expandedRowRender={expandedRowRender(workersTableStats(), dataSource)}
    />
  );
}

WorkersTable.propTypes = {
  dataSource: PropTypes.array,
  stats: PropTypes.object
};

export default WorkersTable;
