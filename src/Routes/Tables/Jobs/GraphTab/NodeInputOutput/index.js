import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { Table } from 'components';
import { Card, JsonSwitch } from 'components/common';
import getColumns from './getColumns';

const NodeInputOutput = ({ algorithm = {}, payload }) => {
  const { socketUrl } = useSelector(selectors.connection);
  const mapTask = (task, { downloadFileExt }) => ({
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
    downloadFileExt,
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
      columns={getColumns(socketUrl)}
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
  // TODO: detail the props
  // eslint-disable-next-line
  payload: PropTypes.object.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  algorithm: PropTypes.object.isRequired,
};

export default React.memo(NodeInputOutput);
