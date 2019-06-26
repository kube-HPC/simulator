import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Tag, Tooltip, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import humanizeDuration from 'humanize-duration';
import { downloadStorageResults } from 'actions/jobs.action';
import JsonView from 'components/containers/json/JsonView.react';
import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import { STATUS } from 'constants/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

class NodeInputOutput extends Component {
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
      dataSource = payload.batch.map(b => ({
        index: b.batchIndex,
        origInput: payload.origInput,
        input: b.input,
        output: b.output && b.output.storageInfo,
        error: b.error,
        status: b.status,
        retries: b.retries || 0,
        startTime: b.startTime,
        endTime: b.endTime
      }));
    } else {
      dataSource = [
        {
          index: 1,
          origInput: payload.origInput,
          input: payload.input,
          output: payload.output && payload.output.storageInfo,
          error: payload.error,
          status: payload.status,
          retries: payload.retries || 0,
          startTime: payload.startTime,
          endTime: payload.endTime
        }
      ];
    }

    const statuses = ['active', 'succeed', 'failed'];
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
        width: '10%'
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
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
        render: (_, record) => (
          <span>
            {humanizeDuration(
              record.endTime
                ? record.endTime - record.startTime
                : Date.now() - record.startTime,
              {
                maxDecimalPoints: 2
              }
            )}
          </span>
        )
      },
      {
        title: 'retries',
        dataIndex: 'retries',
        key: 'retries',
        width: '10%'
      },
      {
        title: 'Results',
        dataIndex: 'results',
        key: 'results',
        width: '30%',
        render: (_, record) => {
          const downloadAction = (
            <Tooltip placement="top" title={'Download Results'}>
              <Button
                type="default"
                disabled={!record.output}
                shape="circle"
                icon="download"
                onClick={() =>
                  this.props.downloadStorageResults(record.output.path)
                }
              />
            </Tooltip>
          );

          return (
            <Row type="flex" justify="start" gutter={10}>
              <Col>{downloadAction}</Col>
            </Row>
          );
        }
      }
    ];

    return (
      <InfinityTable
        columns={TableColumns}
        dataSource={dataSource}
        expandedRowRender={record => {
          return (
            <Card>
              <JsonView jsonObject={record} onSelect={p => this.onSelect(p)} />
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
