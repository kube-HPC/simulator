import { Table } from 'components';
import { Card, JsonSwitch } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import useNodeIOColumns from './getNodeIOColumns.react';

const NodeInputOutput = ({ algorithm, payload }) => {
  const mapTask = (task, algorithm) => ({
    index: task.batchIndex || 1,
    origInput: task.origInput,
    input: task.input,
    output: task.output && task.output.storageInfo,
    error: task.error,
    warnings: task.warnings,
    status: task.status,
    podName: task.podName,
    taskId: task.taskId,
    retries: task.retries || 0,
    startTime: task.startTime,
    endTime: task.endTime,
    downloadFileExt: algorithm.downloadFileExt,
  });

  const dataSource =
    payload.batch && payload.batch.length > 0
      ? payload.batch.map(b => ({
        ...mapTask(b, algorithm),
        origInput: payload.origInput,
      }))
      : [mapTask(payload, algorithm)];

  return (
    <Table
      rowKey={({ index }) => index}
      columns={useNodeIOColumns()}
      dataSource={dataSource}
      expandedRowRender={record => (
        <Card>
          <JsonSwitch obj={record} />
        </Card>
      )}
    />
  );
};

NodeInputOutput.propTypes = {
  payload: PropTypes.object.isRequired,
  algorithm: PropTypes.object.isRequired,
};

export default NodeInputOutput;
