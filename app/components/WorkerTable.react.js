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
            console.log('blaaaaa');
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
                title: 'worker id',
                dataIndex: 'workerId',
                key: 'workerId',
                width: '25%',
                onFilter: (value, record) => record.workerId.includes(value),
                sorter: (a, b) => sorter(a.workerId, b.workerId)
            },
            {
                title: 'Node name',
                dataIndex: 'jobData.name',
                width: '15%',
                key: 'jobDataName',
                render: (text, record) => (<span>
                  <Tag color="blue" > {record.data.jobData.node}</Tag>
                </span>
        ),
                sorter: (a, b) => sorter(a.data.jobData.node, b.data.jobData.node)
            },
            {
                title: 'Job id',
                dataIndex: 'data.jobData.jobID',
                key: 'jobID',
                width: '35%',
                sorter: (a, b) => sorter(a.data.jobId, b.data.jobId)
            },
      { title: 'Batch', dataIndex: 'data.jobData.batchPart', key: 'batchPart', width: '5%' },
      { title: 'Pipeline Name', dataIndex: 'data.jobData.pipelineName', key: 'pipelineName', width: '10%' },
            {
                title: 'State',
                dataIndex: 'data.state',
                width: '10%',
                key: 'state',
                render: (text, record) => (<span>
                  <Tag color={RECORD_STATUS[record.data.state]} > {record.data.state}</Tag>
                </span>
        ),
                sorter: (a, b) => sorter(a.data.state, b.data.state)
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
          expandedRowRender={(bla) => (
            <Card title="Full details">
              <ReactJson src={bla}/>
            </Card>

          )}/>
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
