// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import Immutable from 'seamless-immutable';
import { Table, Card, Icon, Tag, Button, Row, Col, Progress, Pagination } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/workerTable.action';
import PopoverConfirmOperation from './PopoverConfirmOperation.react';
import { createSelector } from 'reselect';
import React, { PropTypes, Component } from 'react';
import { withState } from 'recompose';

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
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init();
    const callPopOverWorkAround = (isVisible) => {
      this.props.onPopoverClickVisible(isVisible);
    };

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      //   console.log(b.additional.worker.lastVid);
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };
    this.columns = [
      {
        title: 'Job ID',
        dataIndex: 'data.jobID',
        key: 'jobID',
        width: '20%',
        sorter: (a, b) => sorter(a.data.jobID, b.data.jobID)
      },
      {
        title: 'Pod Name',
        dataIndex: 'data.podName',
        key: 'podName',
        width: '20%',
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
        title: 'Batch ID',
        dataIndex: 'data.jobData.batchID',
        key: 'batchID',
        width: '10%',
        sorter: (a, b) => sorter(a.data.jobData.batchID, b.data.jobData.batchID)
      },
      {
        title: 'Worker State',
        dataIndex: 'data.workerStatus',
        width: '10%',
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
        width: '10%',
        key: 'jobStatus',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.data.jobStatus]} > {record.data.jobStatus}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.jobStatus, b.data.jobStatus)
      }
    ];
  }

  renderColumns() {

  }

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
          pagination={{
            defaultCurrent: 1, pageSize: 15
          }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record} />
            </Card>

          )} />
      </div>
    );
  }

}


const workerTable = (state) => state.workerTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  workerTable,
  autoCompleteFilter,
  (workerTable, autoCompleteFilter) => {
    let returnData = workerTable;
    if (autoCompleteFilter != '') {
      returnData = workerTable.filter((row) =>
        Object.values(row).find((f) => f.toString().includes(autoCompleteFilter)) ||
        (row.additional.worker.lastVid ? row.additional.worker.lastVid.includes(autoCompleteFilter) : false)
      );
    }
    return returnData;
  }
);

WorkerTable.propTypes = {
  // columns: React.PropTypes.array.isRequired,
  dataSource: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  // columns: state.containerTable.columns,
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(WorkerTable)
);
