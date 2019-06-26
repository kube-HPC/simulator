import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import JsonView from 'components/common/json/JsonView.react';
import CardRow from 'components/common/CardRow.react';
import tableColumns from 'components/UI/tables/Jobs/NodeInputOutputColumns.react';

import { downloadStorageResults } from 'actions/jobs.action';

function NodeInputOutput({ payload }) {
  const dispatch = useDispatch();

  const onSelect = useCallback(
    select =>
      select.namespace &&
      (select.namespace.includes('input') ||
        select.namespace.includes('output')) &&
      select.name === 'path' &&
      select.value &&
      dispatch(downloadStorageResults(select.value)),
    [dispatch]
  );

  const dataSource =
    payload.batch && payload.batch.length > 0
      ? payload.batch.map(b => ({
          index: b.batchIndex,
          origInput: payload.origInput,
          input: b.input,
          output: b.output && b.output.storageInfo,
          error: b.error,
          status: b.status,
          retries: b.retries || 0,
          startTime: b.startTime,
          endTime: b.endTime
        }))
      : [
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

  return (
    <DynamicTable
      rowKey={record => record.index}
      columns={tableColumns(dispatch)}
      dataSource={dataSource}
      expandedRowRender={record => (
        <CardRow>
          <JsonView jsonObject={record} onSelect={onSelect} />
        </CardRow>
      )}
    />
  );
}

NodeInputOutput.propTypes = {
  payload: PropTypes.object.isRequired
};

export default NodeInputOutput;
