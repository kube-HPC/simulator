import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Card, Button, Icon, Popover, Input, InputNumber, Modal, Select, Row, Col } from 'antd';
import ReactJson from 'react-json-view';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';
import { openModal } from '../actions/modal.action';
import { init, storeAlgorithm, deleteAlgorithmFromStore } from '../actions/algorithmTable.action';
import FillAsJsonButton from './FillAsJsonButton.react';
import algorithmObjectTemplate from './lib/algorithm-object.json';

const RECORD_STATUS = {
  bootstrap: '#2db7f5',
  ready: '#87d068',
  init: '#f50',
  working: '#ec8c16',
  shutdown: '#87d068',
  error: '#87d068',
  stop: '#87d068'
};

class AlgorithmTable extends Component {

  componentWillMount() {
    this.props.init();
    this.state = { isVisible: false };
    this.state = { algoToAdd: { ...algorithmObjectTemplate } };

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };

    const deleteConfirmAction = (action, record) => {
      Modal.confirm(
        {
          title: 'WARNING Deleting Algorithm',
          content: 'Deleting algorithm will DELETE-ALL related pipelines and STOP-ALL executions',
          okText: 'Confirm',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            action(record.data.name);
          },
          onCancel() {}
        },
      );
    };

    this.columns = [
      {
        title: 'Algorithm Name',
        dataIndex: 'data.name',
        key: 'name',
        width: '20%',
        sorter: (a, b) => sorter(a.data.name, b.data.name)
      },
      {
        title: 'Algorithm Image',
        dataIndex: 'data.algorithmImage',
        key: 'algorithmImage',
        width: '20%',
        onFilter: (value, record) => record.data.algorithmImage.includes(value),
        sorter: (a, b) => sorter(a.data.algorithmImage, b.data.algorithmImage)
      },
      {
        title: 'cpu',
        dataIndex: 'data.cpu',
        key: 'cpu',
        width: '20%'
      },
      {
        title: 'mem',
        dataIndex: 'data.mem',
        key: 'mem',
        width: '20%',
        sorter: (a, b) => sorter(a.data.mem, b.data.mem)
      },
      {
        title: 'Worker Image',
        dataIndex: 'data.workerImage',
        key: 'workerImage',
        width: '10%',
        sorter: (a, b) => sorter(a.data.workerImage, b.data.workerImage)
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        render: (text, record) => (<div>
          <Button onClick={() => deleteConfirmAction(this.props.deleteAlgorithmFromStore, record)}> Delete </Button>
        </div>)
      }
    ];
  }
  onVisible = () => this.setState({ isVisible: !this.state.isVisible })
  onFormDataChange = (e) => {
    this.setState({ formdata: e.target.value });
  }
  onPopOverConfirm = () => {
    this.props.storeAlgorithm(this.state.algoToAdd);
    this.onVisible();
  }
  onPopOverCancel = () => {
    this.onVisible();
  }
  renderColumns() {}
  render() {
    const Option = Select.Option;
    const algoData = this.state.algoToAdd;
    const getMemoryProp = (str, isGetNumber) => isGetNumber ? +str.match(/\d+/g).pop() : str.match(/\D+/g).pop();
    const memoryNum = getMemoryProp(algoData.mem, true);
    const memoryProp = getMemoryProp(algoData.mem, false);
    const algoOptions = Object.entries(algoData.options).filter((p) => p[1]).map((a) => a[0]);

    const AlgorithmInput = (<div style={{ height: 'auto', width: '400' }}>
      <Row style={{ marginBottom: 5 }}>
        <Input 
        defaultValue={algoData.name}
        onChange={(e) => { this.state.algoToAdd.name = e.target.value; }}
        prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }}/>}
        placeholder="Insert algorithm name"/>
      </Row>

      <Row style={{ marginBottom: 5 }}>
        <Input 
          defaultValue={algoData.algorithmImage}
          onChange={(e) => { this.state.algoToAdd.algorithmImage = e.target.value; }}
          prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>}
          placeholder="Insert algorithm image"/>
      </Row>

      <Row style={{ marginBottom: 5 }}>
        <span style={{ fontSize: '12px',
          fontWeight: 'lighter',
          fontFamily: 'monospace',
          letterSpacing: 'normal',
          marginRight: '3%' }}>CPU Usage:</span>
        <InputNumber
          min={1}
          defaultValue={algoData.cpu}
          onChange={(v) => {
            this.state.algoToAdd.cpu = +v;
          }}
          style={{ width: 50 }}/>
      </Row>
      <Row style={{ marginBottom: 5 }}>
        <span style={{ fontSize: '12px',
          fontWeight: 'lighter',
          fontFamily: 'monospace',
          letterSpacing: 'normal',
          marginRight: '3%' }}>Memory Usage:</span>
        <InputNumber
          min={1}
          defaultValue={memoryNum}
          onChange={(v) => {
            this.state.algoToAdd.mem = v + getMemoryProp(algoData.mem, false); 
          }}
          style={{ width: 70 }}/>
        <Select
          defaultValue={memoryProp}
          style={{ width: 50 }}
          onChange={ (v) => {
            this.state.algoToAdd.mem = getMemoryProp(algoData.mem, true) + v;
          }}>
          <Option value="Ki">Ki</Option>
          <Option value="M">M</Option>
          <Option value="Mi">Mi</Option>
          <Option value="Gi">Gi</Option>
          <Option value="m">m</Option>
          <Option value="K">K</Option>
          <Option value="G">G</Option>
          <Option value="T">T</Option>
          <Option value="Ti">Ti</Option>
          <Option value="P">P</Option>
          <Option value="Pi">Pi</Option>
          <Option value="E">E</Option>
          <Option value="Ei">Ei</Option>
        </Select>
      </Row>

      <Row style={{ marginBottom: 40 }}>
        <Select
          defaultValue={algoOptions}
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Options"
          onChange={(v) => {
            const optionsArray = this.state.algoToAdd.options;
            const status = optionsArray[v];
            optionsArray[v] = !status;
          }}>
          <Option key="debug">Debug</Option>
        </Select>
      </Row>

    </div>);
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
              <ReactJson src={record}/>
            </Card>
          )}/>
        <Popover
          placement="topRight"
          content={
            <div >
              {AlgorithmInput}
              <Row gutter={48} style={{ margin: 'auto' }}>
                <Col span={8}>
                  <Button type="primary" onClick={this.onPopOverConfirm}>
                    Confirm
                  </Button>
                </Col>
                <Col span={8}>
                  <FillAsJsonButton
                    algorithm={JSON.stringify(this.state.algoToAdd, null, 2)}
                    action={this.props.storeAlgorithm}/>
                </Col>
                <Col span={8}>
                  <Button onClick={this.onPopOverCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          }
          title="Insert new algorithm to store"
          trigger="click"
          position="topRight"
          visible={this.state.isVisible}>
          <Button
            type="primary" shape="circle" size="default"
            style={{
              position: 'absolute', width: '60px', height: '60px', top: '90%', right: '3%'
            }} onClick={this.onVisible}>
            <Icon type="plus" style={{ fontSize: 40 }}/>
          </Button>
        </Popover>
      </div>
    );
  }
}

const algorithmTable = (state) => state.algorithmTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmTable,
  autoCompleteFilter,
  (algorithmTable, autoCompleteFilter) => algorithmTable
);

AlgorithmTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  init: PropTypes.func.isRequired,
  storeAlgorithm: PropTypes.func.isRequired,
  deleteAlgorithmFromStore: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init, storeAlgorithm, deleteAlgorithmFromStore })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(AlgorithmTable)
);
