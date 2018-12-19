
import { connect } from 'react-redux';
import { Table, Card, Tag } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/workerTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import temp from './lib/worker.json'

const RECORD_STATUS = {
  bootstrap: '#2db7f5',
  ready: '#87d068',
  init: '#f50',
  working: '#ec8c16',
  shutdown: '#87d068',
  error: '#87d068',
  stop: '#87d068'

};

class WorkerTable extends Component {
  componentWillMount() {
    this.props.init();

    
    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };
    this.workerColumns = [
      {
        title: 'Job ID',
        dataIndex: 'data.jobId',
        key: 'jobId',
        width: '10%',
        sorter: (a, b) => sorter(a.data.jobId, b.data.jobId)
      },
      {
        title: 'Pod Name',
        dataIndex: 'data.podName',
        key: 'podName',
        width: '10%',
        onFilter: (value, record) => record.data.podName.includes(value),
        sorter: (a, b) => sorter(a.data.podName, b.data.podName)
      },
      {
        title: 'Pipeline',
        dataIndex: 'data.pipelineName',
        key: 'pipelineName',
        width: '10%'
      },
      {
        title: 'Algorithm',
        dataIndex: 'data.algorithmName',
        key: 'algorithmName',
        width: '10%',
        sorter: (a, b) => sorter(a.data.algorithmName, b.data.algorithmName)
      },
      {
        title: 'Node name',
        dataIndex: 'data.jobData.node',
        key: 'node',
        width: '10%',
        sorter: (a, b) => sorter(a.data.jobData.node, b.data.jobData.node)
      },
      {
        title: 'Batch',
        dataIndex: 'data.jobData.batchID',
        key: 'batchID',
        width: '5%',
        sorter: (a, b) => sorter(a.data.jobData.batchID, b.data.jobData.batchID)
      },
      {
        title: 'Up Time',
        dataIndex: 'data.workerStartingTime',
        key: 'workerStartingTime',
        width: '13%',
        render: (text, record) => (
          <span>
            {record.data.workerStartingTime && new Date(record.data.workerStartingTime).toLocaleString()}
          </span>),
        sorter: (a, b) => sorter(a.data.workerStartingTime, b.data.workerStartingTime)

      },
      {
        title: 'Job Time',
        dataIndex: 'data.jobCurrentTime',
        key: 'jobCurrentTime',
        width: '13%',
        render: (text, record) => (
          <span>
            {record.data.jobCurrentTime && new Date(record.data.jobCurrentTime).toLocaleString()}
          </span>),
        sorter: (a, b) => sorter(a.data.jobCurrentTime, b.data.jobCurrentTime)

      },

      {
        title: 'Worker State',
        dataIndex: 'data.workerStatus',
        width: '5%',
        key: 'workerStatus',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.data.workerStatus]} > {record.data.workerStatus}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.workerStatus, b.data.workerStatus)
      },
      {
        title: 'Job State',
        dataIndex: 'data.jobStatus',
        width: '5%',
        key: 'jobStatus',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.data.jobStatus]} > {record.data.jobStatus}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.jobStatus, b.data.jobStatus)
      },
      {
        title: 'Paused',
        dataIndex: 'data.workerPaused',
        width: '5%',
        key: 'workerPaused',
        render: (text, record) => (<span>
          <Tag color={record.data.workerPaused ? 'red' : 'green'} > {record.data.workerPaused ? 'paused' : 'ready'}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.workerPaused, b.data.workerPaused)
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
        title: 'Count',
        key: 'count',
        dataIndex: 'count'
      }
    ];
  }

  renderColumns() {}



  render() {
    
    const { dataSource, stats } = this.props;
    const tempStats = JSON.parse(JSON.stringify(temp));
    const expandedRowRender = (columns,dataSource) => () =>{
      return (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record}/>
            </Card>
          )}/>
      );
    }
    return (
      <div>
        <Table
          columns={this.workerStatsColumns}
          // {dataSource={stats.asMutable()}}
          dataSource={tempStats}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          expandedRowRender={expandedRowRender(this.workerColumns,dataSource.asMutable())}/>
        {/* <Table
          columns={this.workerColumns}
          dataSource={dataSource.asMutable()}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record}/>
            </Card>

          )}/> */}
      </div>
    );
  }
}



const workerTable = (state) => state.workerTable.dataSource;
const stats = (state) => state.workerTable.stats;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  [workerTable],
  (dataSource) => dataSource
);
const statsSelector = createSelector(
  [stats],
  (stats) => stats
);

WorkerTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  stats: PropTypes.array.isRequired

};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  stats: stats(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(WorkerTable)
);
