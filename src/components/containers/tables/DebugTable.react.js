// libs

import { connect } from 'react-redux';
import { Table, Card, Button, Icon, Form, Input, Tag, Row, Col, notification, Popover } from 'antd';
import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { openModal } from '../../../actions/modal.action';
import { init, addAlgorithm,deleteAlgorithm} from '../../../actions/debugTable.action';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    const AlgorithmInput = (
      <div style={{ height: 'auto', width: '300' }}>
        <Row style={{ marginBottom: 5 }}>
          <Input 
            onChange={this.onFormDataChange}
            prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }}/>} 
            placeholder="Algorithm"/>
        </Row>

      </div>
    );

    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
          pagination={{ defaultCurrent: 1, pageSize: 15, hideOnSinglePage: true, style: { paddingRight: '30px' }}}
          locale={{ emptyText: 'no data' }}
          expandedRowRender={(record) => (
            <Card title="Full details">
              <ReactJson src={record}/>
            </Card>
          )}/>
        <Popover 
          placement="topRight"
          isVisible={this.state.isVisible} 
          position="topRight" 
          trigger="click"
          content={
            <div >
              {AlgorithmInput}
              <Row type="flex" justify="space-between">
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.onPopOverConfirm} style={{ margin: 'auto' }}>
                    Confirm
                  </Button>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Button onClick={this.onPopOverCancel}  style={{ margin: 'auto' }}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
            }>
          <Button
            type="primary" shape="circle" size="default"
            style={{
              textAlign: 'center',
              position: 'absolute',
              width: '56px',
              height: '56px',
              top: '90%',
              right: '3%',
              boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)'
            }} onClick={this.onVisible}>
            <Icon type="plus" width="24px" height="24px" style={{ margin: 'auto', fontSize: 'x-large' }}/>
          </Button>
        </Popover>
      </div>
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
  dataSource: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(mapStateToProps, { openModal, init, addAlgorithm,deleteAlgorithm })(DebugTable);

