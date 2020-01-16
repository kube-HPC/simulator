import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { downloadStorageResults } from 'actions/jobs.action';
import { Table } from 'components';
import { Card, JsonSwitch } from 'components/common';
import getNodeIOColumns from './getNodeIOColumns.react';

const NodeInputOutput = ({ payload }) => {
  const dispatch = useDispatch();

  const downloadResult = useCallback(value => dispatch(downloadStorageResults(value)), [dispatch]);

  const onSelect = useCallback(
    select =>
      select.namespace &&
      (select.namespace.includes('input') || select.namespace.includes('output')) &&
      select.name === 'path' &&
      select.value &&
      downloadResult(select.value),
    [downloadResult],
  );

  const mapTask = task => ({
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
  });

  const dataSource =
    payload.batch && payload.batch.length > 0
      ? payload.batch.map(b => ({
        ...mapTask(b),
        origInput: payload.origInput,
      }))
      : [mapTask(payload)];

  return (
    <Table
      rowKey={({ index }) => index}
      columns={getNodeIOColumns({ downloadResult })}
      dataSource={dataSource}
      expandedRowRender={record => (
        <Card>
          <JsonSwitch obj={record} onSelect={onSelect} />
        </Card>
      )}
    />
  );
};

NodeInputOutput.propTypes = {
  payload: PropTypes.object.isRequired,
};

export default NodeInputOutput;
