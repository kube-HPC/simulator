// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import Immutable from 'seamless-immutable';
import { Table, Card, Icon, Tag, Button, Row, Col, Progress, Pagination } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/containerTable.action';
import PopoverConfirmOperation from './PopoverConfirmOperation.react';
import { createSelector } from 'reselect';
import React, { PropTypes, Component } from 'react';
import { withState } from 'recompose';
const RECORD_STATUS = {
  active: '#2db7f5',
  completed: '#87d068',
  failed: '#f50',
  stopped: '#ec8c16'
};

class ContainerTable extends Component {
  // constructor(props) {
  //   super(props);

  //   this.props.init();
  //   this.bla =()=>{
  //     this.props.onPopoverClickVisible(true)
  //   }
  // }


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
        title: 'pipeline name',
        dataIndex: 'key',
        key: 'key',
        width: '20%',
        onFilter: (value, record) => record.key.includes(value),
        sorter: (a, b) => sorter(a.key, b.key)
      },
      {
        title: 'Status',
        dataIndex: 'stat',
        width: '5%',
        key: 'data.status',
        render: (text, record) => (<span>
          <Tag color={RECORD_STATUS[record.data.status]}>{record.data.status}</Tag>
        </span>
        ),
        sorter: (a, b) => sorter(a.data.status, b.data.status)
      },
      {
        title: 'time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '10%',
        sorter: (a, b) => sorter(a.timestamp, b.timestamp)
      },
      { title: 'Algorithm name', dataIndex: 'key1', key: 'key1', width: '10%' },
      { title: 'Node name', dataIndex: 'key2', key: 'key2', width: '10%' },
      { title: 'Description', dataIndex: 'data.details', key: 'details', width: '20%' },
      {
        title: 'Progress',
        dataIndex: 'Status',
        width: '45%',
        key: 'y',
        render: (text, record) => {
          if (record.data.progress === '100%') {
            return (<span>
              <Progress percent={record.data.progress} status="active"/>
            </span>);
          }
          return (<span>
            <Progress percent={record.data.progress}/>
          </span>);
        },

        sorter: (a, b) => sorter(a.data.progress, b.data.progress)
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
              <ReactJson src={record}/>
            </Card>

          )}/>
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
    let returnData = containerTable;
    if (autoCompleteFilter != '') {
      returnData = containerTable.filter((row) =>
        Object.values(row).find((f) => f.toString().includes(autoCompleteFilter)) ||
        (row.additional.worker.lastVid ? row.additional.worker.lastVid.includes(autoCompleteFilter) : false)
      );
    }
    return returnData;
  }
);

ContainerTable.propTypes = {
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
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(ContainerTable)
);
