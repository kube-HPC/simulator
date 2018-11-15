import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card, Button, Icon, Popover, Input } from 'antd';
import ReactJson from 'react-json-view';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';
import { openModal } from '../actions/modal.action';
import { init, storeAlgorithm, deleteAlgorithmFromStore } from '../actions/algorithmTable.action';

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
    this.state = { algoToAdd: { name: 'name', algorithmImage: 'algorithmImage', cpu: 'cpu', mem: 'mem' } };

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
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
          <Button onClick={() => {
            this.props.deleteAlgorithmFromStore(record.data.name);
          }}> Delete </Button>
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
    const AlgorithmInput = (<div style={{ height: '200px', width: '400px' }}>
      <Input 
      onChange={(e) => { this.state.algoToAdd.name = e.target.value; }}
      prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="name"/>
      <Input 
      onChange={(e) => { this.state.algoToAdd.algorithmImage = e.target.value; }}
      prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="algorithmImage"/>
      <Input 
      onChange={(e) => { this.state.algoToAdd.cpu = e.target.value; }}
      prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="cpu"/>
      <Input 
      onChange={(e) => { this.state.algoToAdd.mem = e.target.value; }}
      prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="mem"/>
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
          content={
            <div >
              {AlgorithmInput}
              <Button type="primary" onClick={this.onPopOverConfirm}> Confirm </Button>
              <Button style={{ left: '65%' }} onClick={this.onPopOverCancel}> Cancel </Button>
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
  dataSource: React.PropTypes.array.isRequired,
  init: React.PropTypes.func.isRequired,
  storeAlgorithm: React.PropTypes.func.isRequired,
  deleteAlgorithmFromStore: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init, storeAlgorithm, deleteAlgorithmFromStore })(
  withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(AlgorithmTable)
);
