import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Button, Popover, Modal, Row, Col, Badge } from 'antd';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';

import { openModal } from '../../../actions/modal.action';
import { getAlgorithmReadme } from '../../../actions/readme.action';
import { init, storeAlgorithm, deleteAlgorithmFromStore, applyAlgorithm } from '../../../actions/algorithmTable.action';
import AlgorithmTabSwitcher from '../../dumb/AlgorithmTabSwitcher';

import FloatingAddButton from '../../dumb/FloatingAddButton.react';
import './AlgorithmsTable.scss';
import AddAlgorithmModal from '../../dumb/AddAlgorithmModal.react';
import HEditor from '../HEditor.react';

class AlgorithmTable extends Component {
  state = {
    isVisible: false,
    isAddAlgoVisible: false
  };
  componentWillMount() {
    this.props.init();
    this.setState({ isVisible: false });

    const sorter = (a, b) => {
      let tempA = null;
      let tempB = null;
      tempA = a || '';
      tempB = b || '';
      return tempA.localeCompare(tempB);
    };

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
        render: (text, record, index) => (
          <Row type="flex" justify="start">
            <Col span={4}>
              <HEditor
                jsonTemplate={JSON.stringify(record.data, null, 2)}
                styledButton={(onClick, isEditable = false) => (
                  <Badge dot={isEditable}>
                    <Button type="edit" shape="circle" icon="edit" onClick={onClick} />
                  </Badge>
                )}
                title={'Edit Algorithm'}
                okText={'Update'}
                action={this.props.storeAlgorithm}
              />
            </Col>
            <Col span={4}>
              <Button type="danger" shape="circle" icon="delete" onClick={() => deleteConfirmAction(this.props.deleteAlgorithmFromStore, record)} />
            </Col>
          </Row>
        )
      }
    ];
  }

  onVisible = () => this.setState({ isVisible: !this.state.isVisible });
  toggleAddAlgoVisible = () => this.setState({ isAddAlgoVisible: !this.state.isAddAlgoVisible });

  render() {
    const { dataSource, algorithmReadme } = this.props;

    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource.asMutable()}
          pagination={{ className: 'tablePagination', defaultCurrent: 1, pageSize: 15, hideOnSinglePage: true }}
          locale={{ emptyText: 'no data' }}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getAlgorithmReadme(record.key);
            }
          }}
          expandedRowRender={record => <AlgorithmTabSwitcher algorithmDetails={record} readme={algorithmReadme && algorithmReadme[record.key] && algorithmReadme[record.key].readme} />}
        />

        <FloatingAddButton onClick={this.toggleAddAlgoVisible}> </FloatingAddButton>
        <AddAlgorithmModal visible={this.state.isAddAlgoVisible} onSubmit={this.props.applyAlgorithm} toggleVisible={this.toggleAddAlgoVisible} />
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
  getAlgorithmReadme: PropTypes.func.isRequired,
  storeAlgorithm: PropTypes.func.isRequired,
  deleteAlgorithmFromStore: PropTypes.func.isRequired,
  applyAlgorithm: PropTypes.func.isRequired,
  algorithmReadme: PropTypes.object
};

const mapStateToProps = state => ({
  dataSource: tableDataSelector(state),
  scriptsPath: state.serverSelection.currentSelection.scriptsPath,
  sshUser: state.serverSelection.currentSelection.user,
  algorithmReadme: state.algorithmReadme
});

export default connect(
  mapStateToProps,
  { openModal, init, storeAlgorithm, deleteAlgorithmFromStore, getAlgorithmReadme, applyAlgorithm }
)(withState('isVisible', 'onPopoverClickVisible', { visible: false, podName: '' })(AlgorithmTable));
