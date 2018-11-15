// libs

import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table, Card, Button, Icon, Form, Input, Tag,message,notification } from 'antd';
import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { openModal } from '../actions/modal.action';
import { init, addAlgorithm,deleteAlgorithm} from '../actions/debugTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState, withStateHandlers, compose } from 'recompose';
import PopOver from './PopoverConfirmOperation.react'
const FormItem = Form.Item;
const RECORD_STATUS = {
  bootstrap: '#2db7f5',
  ready: '#87d068',
  init: '#f50',
  working: '#ec8c16',
  shutdown: '#87d068',
  error: '#87d068',
  stop: '#87d068'
};

class DebugTable extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init();
    // const callPopOverWorkAround = (isVisible) => {
    //   this.props.onPopoverClickVisible(isVisible);
    // };
    this.state = { isVisable: false }
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
        width: '40%',
        sorter: (a, b) => sorter(a.data.name, b.data.name)
      },
      // {
      //   title: 'Algorithm Image',
      //   dataIndex: 'data.algorithmImage',
      //   key: 'algorithmImage',
      //   width: '20%',
      //   onFilter: (value, record) => record.data.algorithmImage.includes(value),
      //   sorter: (a, b) => sorter(a.data.algorithmImage, b.data.algorithmImage)
      // },

      // {
      //   title: 'mem',
      //   dataIndex: 'data.mem',
      //   key: 'mem',
      //   width: '20%',
      //   sorter: (a, b) => sorter(a.data.mem, b.data.mem)
      // },
      {
        title: 'path',
        dataIndex: 'data.path',
        key: 'path',
        width: '40%',
        sorter: (a, b) => sorter(a.data.path, b.data.path),
        render: (text, record) =>
          <CopyToClipboard text={`${window.location.origin}/${record.data.path}`} onCopy={() => notification.success({
            message:'Copied to clipboard',
           description:`` 
          })}>
            <Tag color="#399114">
              <div>
                <Icon type="right" style={{ color: 'rgba(255,255,255,.75)', marginRight: '10px' }} />
                {`${window.location.origin}/${record.data.path}`}
              </div>
            </Tag>
          </CopyToClipboard>
      },
      {
        title: 'stop',
        dataIndex: '',
        key: 'stop',
        width: '20%',
        render: (text, record) =>
         <Button type="danger" shape="circle" icon="close" onClick ={ ()=>this.onDelete(record.key) }/>
      }
    ];
  }

  renderColumns() {
  }
  onVisible = () => this.setState({ isVisable: !this.state.isVisable })
  onFormDataChange = (e) => {
    this.setState({ formdata: e.target.value })
  }
  onPopOverConfirm = () => {
    this.props.addAlgorithm(this.state.formdata);
    this.onVisible()
  }
  onDelete = (algorithmName)=>{
    this.props.deleteAlgorithm(algorithmName)
  }
  onPopOverCancel = () => {
    this.onVisible()
  }
  render() {
    const AlgorithmInput = <div style={{ height: "200px", width: "400px" }}>
      <Input onChange={this.onFormDataChange}
        prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Algorithm" />
    </div>

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
        <PopOver isVisible={this.state.isVisable} position="topRight" content={AlgorithmInput}
          onConfirm={this.onPopOverConfirm} onCancel={this.onPopOverCancel}>
          <Button type="primary" shape="circle" size="500px" style={{
            position: 'absolute', width: '60px', height: '60px', top: '90%', right: '3%'
          }} onClick={this.onVisible}>
            <Icon type="plus" style={{ fontSize: 40 }} />
          </Button>
        </PopOver>
      </div >
    );
  }
}

const debugTable = (state) => state.debugTable.dataSource;
const autoCompleteFilter = (state) => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  debugTable,
  autoCompleteFilter,
  (debugTable, autoCompleteFilter) => debugTable
);

DebugTable.propTypes = {
  dataSource: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init, addAlgorithm,deleteAlgorithm })(DebugTable);

