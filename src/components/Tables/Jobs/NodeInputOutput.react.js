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

  const dataSource =
    payload.batch && payload.batch.length > 0
      ? payload.batch.map(b => ({
        index: b.batchIndex,
        origInput: payload.origInput,
        input: b.input,
        output: b.output && b.output.storageInfo,
        error: b.error,
        prevErrors: b.prevErrors,
        status: b.status,
        retries: b.retries || 0,
        startTime: b.startTime,
        endTime: b.endTime,
      }))
      : [
        {
          index: 1,
          origInput: payload.origInput,
          input: payload.input,
          output: payload.output && payload.output.storageInfo,
          error: payload.error,
          prevErrors: payload.prevErrors,
          status: payload.status,
          retries: payload.retries || 0,
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
      ];

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
