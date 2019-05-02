import { connect } from 'react-redux';
import { Table, Tabs, Card, Tag, Button, Icon } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../../../actions/modal.action';
import { init } from '../../../actions/workerTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import defaultWorkerData from 'config/template/worker.template';
import paginationStyle from 'config/template/table-pagination.template';

const STATUS = {
  bootstrap: '#2db7f5',
  ready: '#87d068',
  init: '#eeda13',
  working: '#838383',
  shutdown: '#87d068',
  error: '#f30',
  exit: '#f50',
  stop: '#ec8c16',
  count: '#2db7f5',
  failed: 'red',
  succeed: 'green'
};

class WorkersTable extends Component {
  componentWillMount() {
    this.props.init();
    const undefinedStateFilter = state => state || 'creating';
    this.workerColumns = [
      {
        title: '',
        dataIndex: 'data.workerStatus',
        width: '2%',
        key: 'workerStatusIcon',
        render: (text, record) => (
          <span>
            {record.data.workerPaused ? (
              <Icon type="pause-circle" theme="twoTone" twoToneColor="red" />
            ) : null}
            {record.data.hotWorker ? (
              <Icon type="fire" theme="filled" style={{ color: 'orange' }} />
            ) : null}
          </span>
        )
      },
      {
        title: 'Pod Name',
        dataIndex: 'data.podName',
        key: 'podName',
        onFilter: (value, record) => record.data.podName.includes(value)
      },
      {
        title: 'Worker State',
        dataIndex: 'data.workerStatus',
        width: '30%',
        key: 'workerStatus',
        render: (text, record) => (
          <span>
            <Tag color={STATUS[record.data.workerStatus]}>
              {' '}
              {undefinedStateFilter(record.data.workerStatus)}
            </Tag>
            {/* {record.data.hotWorker?<Tag color={'orange'} >hot</Tag>:null} */}
            <Tag color={STATUS[record.data.jobStatus]}>
              {' '}
              {'job ' + undefinedStateFilter(record.data.jobStatus)}
            </Tag>
          </span>
        )
      },
      {
        title: 'Job ID',
        dataIndex: 'data.jobId',
        width: '30%',
        key: 'jobId'
      },
      {
        title: 'View Logs',
        dataIndex: 'data.logs',
        width: '10%',
        key: 'logs',
        render: () => (
          <span>
            <Button size="small" icon="read" />
          </span>
        )
      }
    ];

    this.workerStatsColumns = [
      {
        title: 'Algorithm Name',
        key: 'algorithmName',
        dataIndex: 'algorithmName'
      },
      {
        title: 'Ready Count',
        key: 'readyCount',
        dataIndex: 'ready'
      },
      {
        title: 'Working Count',
        key: 'workingCount',
        dataIndex: 'working'
      },
      {
        title: 'Init Count',
        key: 'initCount',
        dataIndex: 'init'
      },
      {
        title: 'Exit Count',
        key: 'exitCount',
        dataIndex: 'exit'
      },
      {
        title: 'Hot Count',
        key: 'hotCount',
        dataIndex: 'hot'
      },
      {
        title: 'Count',
        key: 'count',
        dataIndex: 'count'
      }
    ];
  }

  renderColumns() {}

  render() {
    const { dataSource, stats } = this.props;

    // TODO: in prod use stats
    // const tempStats = JSON.parse(JSON.stringify(workerStats));

    const expandedRowRender = (columns, dataSource) => record => {
      const filteredDataSource = dataSource.filter(
        d => d.data.algorithmName === record.algorithmName
      );

      // const mutableDataSource = JSON.parse(JSON.stringify(filteredDataSource));
      // mutableDataSource.forEach((algo)=> algo.data.jobId = algo.key);

      return (
        <Table
          size="middle"
          columns={columns}
          dataSource={filteredDataSource}
          pagination={paginationStyle}
          expandedRowRender={record => {
            const timer = {
              workerStartingTime:
                record.data.workerStartingTime &&
                new Date(record.data.workerStartingTime).toLocaleString(),
              jobCurrentTime:
                record.data.jobCurrentTime && new Date(record.data.jobCurrentTime).toLocaleString()
            };

            return (
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="JSON" key="1">
                  <Card>
                    <ReactJson
                      src={record}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      iconStyle="square"
                      enableClipboard={false}
                    />
                  </Card>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Additional Details" key="2">
                  <Card>
                    <ReactJson
                      src={timer}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      iconStyle="square"
                      enableClipboard={false}
                    />
                  </Card>
                </Tabs.TabPane>
              </Tabs>
            );
          }}
        />
      );
    };

    const statsMergedWithDefault =
      stats && stats.stats && stats.stats.map(algo => ({ ...defaultWorkerData, ...algo }));
    return (
      <div>
        <Table
          columns={this.workerStatsColumns}
          dataSource={statsMergedWithDefault}
          indentSize={0}
          pagination={{
            className: 'tablePagination',
            defaultCurrent: 1,
            pageSize: 15,
            hideOnSinglePage: true
          }}
          expandedRowRender={expandedRowRender(this.workerColumns, dataSource)}
        />
      </div>
    );
  }
}

const workerTable = state => state.workerTable.dataSource;
const stats = state => state.workerTable.stats;

const tableDataSelector = createSelector(
  [workerTable],
  dataSource => dataSource
);

WorkersTable.propTypes = {
  init: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  stats: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  stats: stats(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(
  mapStateToProps,
  { openModal, init }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(WorkersTable)
);
