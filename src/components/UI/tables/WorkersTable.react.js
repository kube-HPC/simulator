import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createSelector } from 'reselect';
import { withState } from 'recompose';
import { Tabs, Card } from 'antd';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import defaultWorkerData from 'config/template/worker.template';
import {
  workerTableColumns,
  workersTableStats
} from 'components/UI/tables/columns/WorkersTableColumns.react';
import JsonView from 'components/dumb/JsonView.react';
import styled from 'styled-components';

const SmallCard = styled(Card)`
  overflow: scroll;
  height: 300px;
`;

const generateTab = (key, value) => (
  <Tabs.TabPane tab={key} key={key}>
    <SmallCard size="small">
      <JsonView jsonObject={value} />
    </SmallCard>
  </Tabs.TabPane>
);

const expandedRowRender = (columns, dataSource) => record => {
  const filteredDataSource = dataSource.filter(
    d => d.algorithmName === record.algorithmName
  );

  return (
    <InfinityTable
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
          <Tabs defaultActiveKey="1">
            {generateTab('JSON', record)}
            {generateTab('Additional Details', timer)}
          </Tabs>
        );
      }}
    />
  );
};

function WorkersTable(props) {
  const { dataSource, stats } = props;

  const statsMergedWithDefault =
    stats &&
    stats.stats &&
    stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }));
  return (
    <InfinityTable
      rowKey={record => record.algorithmName}
      columns={workerTableColumns(props)}
      dataSource={statsMergedWithDefault}
      expandedRowRender={expandedRowRender(
        workersTableStats(props),
        dataSource
      )}
    />
  );
}

const workerTable = state => state.workerTable.dataSource;

const tableDataSelector = createSelector(
  [workerTable],
  dataSource => dataSource
);

WorkersTable.propTypes = {
  dataSource: PropTypes.array,
  stats: PropTypes.object
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  stats: state.workerTable.stats,
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(
  mapStateToProps,
  null
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(WorkersTable)
);
