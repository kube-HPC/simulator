// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card, Tag, Progress } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/containerTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';

const RECORD_STATUS = {
  active: '#2db7f5',
  completed: '#87d068',
  failed: '#f50',
  stopped: '#ec8c16'
};

class ContainerTable extends Component {
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
        dataIndex: 'key',
        key: 'key',
        width: '20%',
        sorter: (a, b) => sorter(a.key, b.key)
      },
      {
        title: 'Pipeline Name',
        dataIndex: 'status.pipeline',
        key: 'pipeline',
        width: '10%',
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => sorter(a.key, b.key)
      },
      {
        title: 'Status',
        dataIndex: 'status.status',
        width: '5%',
        key: 'status',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.status && record.status.status]}>{record.status && record.status.status}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.status.status, b.status.status)
      },
      {
        title: 'time',
        dataIndex: 'status.timestamp',
        key: 'timestamp',
        width: '15%',
        sorter: (a, b) => sorter(a.timestamp, b.timestamp)
      },
      {
        title: 'Description',
        dataIndex: 'status.data.details',
        key: 'details',
        width: '25%'
      },
      {
        title: 'Progress',
        dataIndex: 'Progress',
        width: '30%',
        key: 'y',
        render: (text, record) => {
          let progress = (record.status && record.status.data && record.status.data.progress) || 0;
          progress = parseInt(progress, 10);
          if (progress === 100) {
            return (<span>
              <Progress percent={progress} />
            </span>);
          }
          return (<span>
            <Progress percent={progress} status="active" />
          </span>);
        },
        sorter: (a, b) => sorter(a.status.data.progress, b.status.data.progress)
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


const containerTable = (state) => state.containerTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  containerTable,
  autoCompleteFilter,
  (containerTable, autoCompleteFilter) => {
    return containerTable;
  }
);

ContainerTable.propTypes = {
  dataSource: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(ContainerTable)
);
