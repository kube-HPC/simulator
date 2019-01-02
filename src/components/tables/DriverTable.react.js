
import { connect } from 'react-redux';
import { Table, Card, Tag } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../../actions/modal.action';
import { init } from '../../actions/driverTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

const STATUSES = {
  bootstrap: '#87d068',
  ready: '#87d068',
  init: '#87d068',
  active: '#2db7f5',
  stopped: '#ec8c16',
  failed: '#f50',
  completed: '#87d068'
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
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };
    this.columns = [
      {
        title: 'Job ID',
        dataIndex: 'data.jobId',
        key: 'jobId',
        width: '20%',
        sorter: (a, b) => sorter(a.data.jobId, b.data.jobId)
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
        width: '15%'
      },
      {
        title: 'Driver State',
        dataIndex: 'data.driverStatus',
        width: '15%',
        key: 'driverStatus',
        render: (text, record) => (<span>
          <Tag color={STATUSES[record.data.driverStatus]} > {record.data.driverStatus}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.driverStatus, b.data.driverStatus)
      },
      {
        title: 'Job State',
        dataIndex: 'data.jobStatus',
        width: '15%',
        key: 'jobStatus',
        render: (text, record) => (<span>
          <Tag color={STATUSES[record.data.jobStatus]} > {record.data.jobStatus}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.jobStatus, b.data.jobStatus)
      },
      {
        title: 'Paused',
        dataIndex: 'data.paused',
        width: '15%',
        key: 'paused',
        render: (text, record) => (<span>
          <Tag color={record.data.paused ? 'red' : 'green'} > {record.data.paused ? 'paused' : 'ready'}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.paused, b.data.paused)
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
          locale={{ emptyText: 'no data' }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record} />
            </Card>

          )} />
      </div>
    );
  }
}

const driverTable = (state) => state.driverTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  driverTable,
  autoCompleteFilter,
  (driverTable, autoCompleteFilter) => {
    return driverTable;
  }
);

WorkerTable.propTypes = {
  dataSource: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(WorkerTable)
);
