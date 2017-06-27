// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import Immutable from 'seamless-immutable';
import { Table, Card, Icon, Tag, Button } from 'antd';
import ReactJson from 'react-json-view';
import { openModal } from '../actions/modal.action';
import { init } from '../actions/containerTable.action';
import PopoverConfirmOperation from './PopoverConfirmOperation.react';
import { createSelector } from 'reselect';
import { Row, Col } from 'antd';
import React, { PropTypes, Component } from 'react';
import { withState } from 'recompose';
const ModalType = {
  BASH: "bash",
  SSH: "ssh",
}

class ContainerTable extends Component {
  // constructor(props) {
  //   super(props);

  //   this.props.init();
  //   this.bla =()=>{
  //     this.props.onPopoverClickVisible(true)
  //   }
  // }

  componentWillMount() {
    this.props.init()
    const callPopOverWorkAround = (isVisible) => {
      console.log('blaaaaa');
      this.props.onPopoverClickVisible(isVisible)
    }
    this.columns = [
      {
        title: 'vid',
        dataIndex: 'additional.worker.lastVid',
        key: 'data.additional.worker.lastVid',
        onFilter: (value, record) => record.additional.worker.lastVid.includes(value),
        sorter: (a, b) => a.additional.worker.lastVid.length - b.additional.worker.lastVid.length
      },
      { title: 'hostName', dataIndex: 'hostName', key: 'hostName' },
      { title: 'podName', dataIndex: 'podName', key: 'podName' },
      { title: 'hostIp', dataIndex: 'hostIp', key: 'hostIp' },
      {
        title: 'ServiceName',
        dataIndex: 'serviceName',
        key: 'serviceName',
        onFilter: (value, record) => record.serviceName.includes(value),
        sorter: (a, b) => a.serviceName.length - b.serviceName.length
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'x',
        render: (text, record) => (
          <span>
            <Tag color="green">{record.additional.worker.lastStatus}</Tag>
          </span>
        )
      },
      {
        title: 'Terminal',
        dataIndex: '',
        rowSpan: 2,
        key: 'y',
        render: (text, record) => (
          <Row type="flex" justify="left" align="middle">
            <Col span={3}>
              <Button onClick={() => this.props.openModal(ModalType.SSH, record, { raw: '' }, {
                type: 'ssh',
                sshuser: this.props.sshUser,
                sshport: 22,
                sshhost: record.hostIp,
                sshauth: 'password'
              })}>
                Host
            </Button>
            </Col>
            <Col span={1}>
              <span className="ant-divider" />
            </Col>
            <Col span={3}>
              <Button onClick={() => this.props.openModal(ModalType.BASH, record, { path: this.props.scriptsPath, execution: `exec`, args: record.podName })}>
                Pod
            </Button>
            </Col>
            <Col span={1}>
              <span className="ant-divider" />
            </Col>
            <Col span={3}>
              <Button onClick={() => this.props.openModal(ModalType.BASH, record, { path: this.props.scriptsPath, execution: `logs`, args: `-f ${record.podName}` })}>
                Log
            </Button>
            </Col>
            <Col span={1}>
              <span className="ant-divider" />
            </Col>
            <Col span={3}>
              <Button onClick={() => this.props.openModal(ModalType.BASH,record, { path: this.props.scriptsPath , execution: `describe`, args: record.podName })}>
                Describe
            </Button>
            </Col>
            <Col span={2}>
            </Col>
            <Col span={2}>
              <PopoverConfirmOperation
                isVisible={(this.props.isVisible.podName==record.podName&&this.props.isVisible.visible)?true:false}
                onConfirm={() => {
                  this.props.openModal(ModalType.BASH,record, { raw: `kubectl delete po ${record.podName}` });
                  callPopOverWorkAround({ visible:false,podName:''});
                }}
                onCancel={() => {
                  callPopOverWorkAround({ visible:false,podName:''});
                }}
              >
                <Button type="danger" onClick={() => { callPopOverWorkAround({visible:true,podName:record.podName}) }}>
                  X
                </Button>
              </PopoverConfirmOperation>
            </Col>
            <Col span={1} />
            {/* <Tag color="green">{record.podName}</Tag>*/}

          </Row >
        )
      }
    ]
  }

  renderColumns() {
    return
  }

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
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
    let returnData = containerTable;
    if (autoCompleteFilter != '') {
      returnData = containerTable.filter((row) =>
        Object.values(row).find((f) => f.toString().includes(autoCompleteFilter))
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
  scriptsPath:state.serverSelection.currentSelection.scriptsPath,
  sshUser:state.serverSelection.currentSelection.user,
});

export default connect(mapStateToProps, { openModal, init })(
  withState('isVisible', 'onPopoverClickVisible', { visible:false,podName:''})(ContainerTable)
);
