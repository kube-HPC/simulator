import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Button, Modal, Row, Col, Badge } from 'antd';
import { createSelector } from 'reselect';
import React, { Component } from 'react';
import { withState } from 'recompose';

import { openModal } from '../../../actions/modal.action';
import { getAlgorithmReadme } from '../../../actions/readme.action';
import {
  init,
  applyAlgorithm,
  deleteAlgorithmFromStore
} from '../../../actions/algorithmTable.action';
import AlgorithmTabSwitcher from '../../dumb/AlgorithmTabSwitcher.react';

import JsonEditorModal from '../../smart/JsonEditorModal.react';
import paginationStyle from 'config/template/table-pagination.template';
class AlgorithmsTable extends Component {
  state = {
    isVisible: false
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
        content:
          'Deleting algorithm will DELETE-ALL related pipelines and STOP-ALL executions',
        okText: 'Confirm',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          action(record.name);
        },
        onCancel() { }
      });
    };

    this.columns = [
      {
        title: 'Algorithm Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        sorter: (a, b) => sorter(a.name, b.name)
      },
      {
        title: 'Algorithm Image',
        dataIndex: 'algorithmImage',
        key: 'algorithmImage',
        width: '20%',
        onFilter: (value, record) => record.algorithmImage.includes(value),
        sorter: (a, b) => sorter(a.algorithmImage, b.algorithmImage)
      },
      {
        title: 'cpu',
        dataIndex: 'cpu',
        key: 'cpu',
        width: '10%'
      },
      {
        title: 'mem',
        dataIndex: 'mem',
        key: 'mem',
        width: '10%',
        sorter: (a, b) => sorter(a.mem, b.mem)
      },
      {
        title: 'Worker Image',
        dataIndex: 'workerImage',
        key: 'workerImage',
        width: '10%',
        sorter: (a, b) => sorter(a.workerImage, b.workerImage)
      },
      {
        title: 'minHotWorkers',
        dataIndex: 'minHotWorkers',
        key: 'minHotWorkers',
        width: '10%',
        sorter: (a, b) => sorter(a.workerImage, b.workerImage)
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => (
          <Row type="flex" justify="start">
            <Col span={4}>
              <JsonEditorModal
                jsonTemplate={JSON.stringify(record, null, 2)}
                styledButton={(onClick, isEditable = false) => (
                  <Badge dot={isEditable}>
                    <Button
                      type="edit"
                      shape="circle"
                      icon="edit"
                      onClick={onClick}
                    />
                  </Badge>
                )}
                title={'Edit Algorithm'}
                okText={'Update'}
                action={this.onSubmit}
              />
            </Col>
            <Col span={4}>
              <Button
                type="danger"
                shape="circle"
                icon="delete"
                onClick={() =>
                  deleteConfirmAction(
                    this.props.deleteAlgorithmFromStore,
                    record
                  )
                }
              />
            </Col>
          </Row>
        )
      }
    ];
  }

  onSubmit = (data) => {
    const formData = new FormData();
    formData.append('payload', JSON.stringify(data));
    this.props.applyAlgorithm(formData);
  };

  onVisible = () => this.setState({ isVisible: !this.state.isVisible });

  render() {
    const { dataSource, algorithmReadme } = this.props;

    return (
      <div>
        <Table
          size="middle"
          columns={this.columns}
          dataSource={dataSource.asMutable().map((d) => {
            const { memReadable, ...rest } = d;
            return {
              ...rest,
              mem: d.memReadable
            }
          })}
          pagination={paginationStyle}
          locale={{ emptyText: 'no data' }}
          onExpand={(expanded, record) => {
            if (expanded) {
              this.props.getAlgorithmReadme(record.key);
            }
          }}
          expandedRowRender={record => (
            <AlgorithmTabSwitcher
              algorithmDetails={record}
              readme={
                algorithmReadme &&
                algorithmReadme[record.key] &&
                algorithmReadme[record.key].readme
              }
            />
          )}
        />
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

AlgorithmsTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  init: PropTypes.func.isRequired,
  getAlgorithmReadme: PropTypes.func.isRequired,
  applyAlgorithm: PropTypes.func.isRequired,
  deleteAlgorithmFromStore: PropTypes.func.isRequired,
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
  {
    openModal,
    init,
    applyAlgorithm,
    deleteAlgorithmFromStore,
    getAlgorithmReadme
  }
)(
  withState('isVisible', 'onPopoverClickVisible', {
    visible: false,
    podName: ''
  })(AlgorithmsTable)
);
