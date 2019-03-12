import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {
  Upload,
  Table,
  Card,
  Button,
  Icon,
  Popover,
  Input,
  InputNumber,
  Modal,
  Select,
  Row,
  Col,
  Badge
} from 'antd';
import ReactJson from 'react-json-view';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';
import parseUnit from 'parse-unit';
import { openModal } from '../../../actions/modal.action';
import {
  init,
  storeAlgorithm,
  applyAlgorithm,
  deleteAlgorithmFromStore
} from '../../../actions/algorithmTable.action';
import HEditor from '../HEditor.react';
import algorithmObjectTemplate from '../../stubs/algorithm-object.json';
import AddButton from '../../dumb/AddButton.react';
import './AlgorithmsTable.scss';
const Dragger = Upload.Dragger;

class AlgorithmTable extends Component {
  constructor(props) {
    super(props);

    this.props.init();

    this.state = { isVisible: false, algoToAdd: { ...algorithmObjectTemplate } };
    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };

    this.dragProps = {
      name: 'file',
      multiple: false,
      accept: '.zip,.tar.gz',
      customRequest: ({ file, onSuccess }) => {
        setTimeout(() => {
          this.setState({ file });
          onSuccess('OK');
        }, 0);
      },
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          console.log(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          console.log(`${info.file.name} file upload failed.`);
        }
      }
    };

    this.dragProps.onChange = this.dragProps.onChange.bind(this);

    const deleteConfirmAction = (action, record) => {
      Modal.confirm({
        title: 'WARNING Deleting Algorithm',
        content: 'Deleting algorithm will DELETE-ALL related pipelines and STOP-ALL executions',
        okText: 'Confirm',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          action(record.data.name);
        },
        onCancel() {}
      });
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
        width: '10%'
      },
      {
        title: 'mem',
        dataIndex: 'data.mem',
        key: 'mem',
        width: '10%',
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
        title: 'minHotWorkers',
        dataIndex: 'data.minHotWorkers',
        key: 'minHotWorkers',
        width: '10%',
        sorter: (a, b) => sorter(a.data.workerImage, b.data.workerImage)
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '20%',
        render: (text, record, index) => (
          <Row type="flex" justify="start">
            <Col span={4}>
              <Button
                type="edit"
                shape="circle"
                icon="edit"
                onClick={() => {
                  this.setState({ isVisible: true });
                  this.setState({
                    algoToAdd: { ...record.data, mem: record.data.mem + 'Mi' }
                  });
                }}
              />
            </Col>
            <Col span={4}>
              <Button
                type="danger"
                shape="circle"
                icon="delete"
                onClick={() => deleteConfirmAction(this.props.deleteAlgorithmFromStore, record)}
              />
            </Col>
          </Row>
        )
      }
    ];
  }

  onVisible = () => this.setState({ isVisible: !this.state.isVisible });

  onFormDataChange = e => {
    this.setState({ formdata: e.target.value });
  };

  onPopOverConfirm = () => {
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('payload', JSON.stringify(this.state.algoToAdd));
    this.props.applyAlgorithm(formData);
    this.onVisible();
  };

  onPopOverCancel = () => {
    this.onVisible();
  };

  renderColumns() {}

  _parseUnit = obj => {
    const [val, unit] = parseUnit(obj);
    return { val, unit };
  };

  render() {
    const Option = Select.Option;
    const algoData = this.state.algoToAdd;
    const memory = this._parseUnit(algoData.mem);
    const algoOptions = Object.entries(algoData.options)
      .filter(p => p[1])
      .map(a => a[0]);

    const AlgorithmInput = (
      <div style={{ height: 'auto', width: '400px' }}>
        <Row style={{ marginBottom: 5 }}>
          <Input
            defaultValue={algoData.name}
            value={algoData.name}
            onChange={e =>
              this.setState({
                algoToAdd: { ...this.state.algoToAdd, name: e.target.value }
              })
            }
            prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert algorithm name"
          />
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Input
            defaultValue={algoData.algorithmImage}
            value={algoData.algorithmImage}
            onChange={e =>
              this.setState({
                algoToAdd: {
                  ...this.state.algoToAdd,
                  algorithmImage: e.target.value
                }
              })
            }
            prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert algorithm image"
          />
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'lighter',
              fontFamily: 'monospace',
              letterSpacing: 'normal',
              marginRight: '3%'
            }}
          >
            Env
          </span>
          <Select
            defaultValue={algoData.env}
            value={algoData.env}
            style={{ width: '60%' }}
            onChange={v => this.setState(state => (state.algoToAdd.env = v))}
          >
            <Option value="python">python</Option>
            <Option value="nodejs">nodejs</Option>
            <Option value="jvm">jvm</Option>
          </Select>
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'lighter',
              fontFamily: 'monospace',
              letterSpacing: 'normal',
              marginRight: '3%'
            }}
          >
            CPU Usage:
          </span>
          <InputNumber
            min={1}
            value={algoData.cpu}
            defaultValue={algoData.cpu}
            onChange={v => this.setState(state => (state.algoToAdd.cpu = +v))}
            style={{ width: 50 }}
          />
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'lighter',
              fontFamily: 'monospace',
              letterSpacing: 'normal',
              marginRight: '3%'
            }}
          >
            GPU Usage:
          </span>
          <InputNumber
            min={0}
            value={algoData.gpu}
            defaultValue={algoData.gpu}
            onChange={v => this.setState(state => (state.algoToAdd.gpu = +v))}
            style={{ width: 50 }}
          />
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'lighter',
              fontFamily: 'monospace',
              letterSpacing: 'normal',
              marginRight: '3%'
            }}
          >
            Memory Usage:
          </span>
          <InputNumber
            min={1}
            value={memory.val}
            defaultValue={memory.val}
            onChange={v =>
              this.setState({
                algoToAdd: {
                  ...this.state.algoToAdd,
                  mem: v + this._parseUnit(algoData.mem).unit
                }
              })
            }
            style={{ width: 'auto' }}
          />
          <Select
            value={memory.unit}
            defaultValue={memory.unit}
            style={{ width: '90px' }}
            onChange={v =>
              this.setState({
                algoToAdd: {
                  ...this.state.algoToAdd,
                  mem: this._parseUnit(algoData.mem).val + v
                }
              })
            }
          >
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
        <Row style={{ marginBottom: 5 }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'lighter',
              fontFamily: 'monospace',
              letterSpacing: 'normal',
              marginRight: '3%'
            }}
          >
            Min Hot Workers:
          </span>
          <InputNumber
            min={0}
            value={algoData.minHotWorkers}
            defaultValue={algoData.minHotWorkers}
            onChange={v => this.setState(state => (state.algoToAdd.minHotWorkers = v))}
            style={{ width: 50 }}
          />
        </Row>
        <Row style={{ marginBottom: 5 }}>
          <Dragger {...this.dragProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag algorithm source code to this area to upload
            </p>
            <p className="ant-upload-hint">Support for zip or tar.gz only</p>
          </Dragger>
        </Row>
        <Row style={{ marginBottom: 40 }}>
          <Select
            defaultValue={algoOptions}
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Options"
            onChange={v => {
              const optionsArray = this.state.algoToAdd.options;
              const status = optionsArray[v];
              optionsArray[v] = !status;
            }}
          >
            <Option key="debug">Debug</Option>
          </Select>
        </Row>
      </div>
    );

    const PopOverContent = (
      <div>
        {AlgorithmInput}
        <Row type="flex" justify="space-between" align="middle">
          <Col span={5} className="textAlign">
            <Button type="primary" onClick={this.onPopOverConfirm} style={{ margin: 'auto' }}>
              Confirm
            </Button>
          </Col>
          <Col span={10} className="textAlign">
            <HEditor
              styledButton={onClick => <Button onClick={onClick}>Add As JSON</Button>}
              jsonTemplate={JSON.stringify(this.state.algoToAdd, null, 2)}
              title={'Store Algorithm Editor'}
              okText={'Store Algorithm'}
              action={this.props.storeAlgorithm}
            />
          </Col>
          <Col span={5} className="textAlign">
            <Button onClick={this.onPopOverCancel} style={{ margin: 'auto' }}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    );

    const { dataSource } = this.props;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
          pagination={{
            className: 'tablePagination',
            defaultCurrent: 1,
            pageSize: 15,
            hideOnSinglePage: true
          }}
          expandedRowRender={record => (
            <Card title="JSON">
              <ReactJson
                src={record.data}
                name={false}
                iconStyle="square"
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
              />
            </Card>
          )}
        />
        <Popover
          placement="topRight"
          content={PopOverContent}
          title="Update algorithm"
          trigger="click"
          visible={this.state.isVisible}
        >
          <AddButton
            onVisible={() => {
              this.onVisible();
              this.setState({ algoToAdd: { ...algorithmObjectTemplate } });
            }}
          />
        </Popover>
      </div>
    );
  }
}

const algorithmTable = state => state.algorithmTable.dataSource;
const autoCompleteFilter = state => state.autoCompleteFilter.filter;

const tableDataSelector = createSelector(
  algorithmTable,
  autoCompleteFilter,
  algorithmTable => algorithmTable
);

AlgorithmTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  init: PropTypes.func.isRequired,
  storeAlgorithm: PropTypes.func.isRequired,
  deleteAlgorithmFromStore: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user
});

export default connect(
  mapStateToProps,
  { openModal, init, storeAlgorithm, applyAlgorithm, deleteAlgorithmFromStore }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(AlgorithmTable)
);
