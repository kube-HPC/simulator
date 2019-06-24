import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Tag } from 'antd';
import PropTypes from 'prop-types';
import humanizeDuration from 'humanize-duration';
import { downloadStorageResults } from 'actions/jobs.action';
import JsonView from 'components/containers/json/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import { STATUS } from 'constants/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

class NodeInputOutput extends Component {
  constructor() {
    super();
    this.isAlreadySelected = false;
    this.currentTaskId = null;
  }

  onSelect(select) {
    if (
      select.namespace &&
      (select.namespace.includes('input') ||
        select.namespace.includes('output')) &&
      select.name === 'path' &&
      select.value
    ) {
      this.props.downloadStorageResults(select.value);
    }
  }

  render() {
    const { props } = this;
    let payload = (props && props.payload) || {};

    let dataSource;

    if (payload.batch && payload.batch.length > 0) {
      dataSource = payload.batch.map((b) => ({
        index: b.batchIndex,
        origInput: payload.origInput,
        input: b.input,
        output: b.output && b.output.storageInfo,
        error: b.error,
        status: b.startTime && b.error ? 'failed' : 'success',
        duration: humanizeDuration(b.endTime - b.startTime)
      }));
    }
    else {
      dataSource = [{
        index: 1,
        origInput: payload.origInput,
        input: payload.input,
        output: payload.output && payload.output.storageInfo,
        error: payload.error,
        status: payload.startTime && payload.error ? 'failed' : 'success',
        duration: humanizeDuration(payload.endTime - payload.startTime)
      }];
    }

    const statuses = ['success', 'failed'];
    const getStatusFilter = () =>
      statuses.map(status => ({
        text: toUpperCaseFirstLetter(status),
        value: status
      }));

    const TableColumns = [
      {
        title: 'index',
        dataIndex: 'index',
        key: 'index',
        width: '20%'
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        width: '50%',
        render: (_, record) => (
          <Tag color={STATUS[record.status]}>
            {toUpperCaseFirstLetter(record.status)}
          </Tag>
        ),
        filterMultiple: true,
        filters: getStatusFilter(),
        onFilter: (value, record) => record.status === value
      },
      {
        title: 'duration',
        dataIndex: 'duration',
        key: 'duration',
        width: '30%',
      }
    ]

    return (
      <InfinityTable
        columns={TableColumns}
        dataSource={dataSource}
        expandedRowRender={record => {
          return (
            <Card>
              <JsonView jsonObject={record} />
            </Card>
          );
        }}
      />
    );
  }
}

const mapStateToProps = state => ({});

NodeInputOutput.propTypes = {
  payload: PropTypes.object,
  downloadStorageResults: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { downloadStorageResults }
)(NodeInputOutput);
