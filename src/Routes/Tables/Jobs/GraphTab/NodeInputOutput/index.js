import PropTypes from 'prop-types';
import { removeNullUndefinedCleanDeep } from 'utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { Table } from 'antd';
import { Card, JsonSwitch } from 'components/common';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import getColumns from './getColumns';

function countByKey(array, nameKey) {
  const result = {};

  array.forEach(obj => {
    const key = obj[nameKey];
    if (!result[key]) {
      result[key] = 1;
    } else {
      result[key]++;
    }
  });

  return result;
}

const NodeInputOutput = ({
  algorithm = {},
  payload,

  isShowOneRow,
}) => {
  const { socketUrl } = useSelector(selectors.connection);
  const mapTask = (task, downloadFileExt) => ({
    index: task.batchIndex || 1,
    origInput: task.origInput,
    input: task.input,
    output: task.output && task.output.storageInfo,
    error: task.error,
    warnings: task.warnings,
    status: task.status === 'succeed' ? 'completed' : task.status, // we change only ui succeed = completed
    podName: task.podName,
    taskId: task.taskId,
    retries: task.retries || 0,
    startTime: task.startTime,
    endTime: task.endTime,
    downloadFileExt,
  });

  const dataSource = useMemo(
    () =>
      payload.batch && payload.batch.length > 0
        ? payload.batch.map(b => ({
            ...mapTask(b, algorithm?.downloadFileExt || ''),
            origInput: payload.origInput,
          }))
        : [mapTask(payload, algorithm?.downloadFileExt || '')],
    [algorithm?.downloadFileExt, payload]
  );

  const tableColumns = useMemo(() => {
    const cols = getColumns(
      socketUrl,
      algorithm.name,
      countByKey(dataSource, 'status'),
      isShowOneRow
    );

    if (
      isShowOneRow ||
      payload.batchInfo === null ||
      (payload.batchInfo?.completed === 0 && payload.batchInfo?.total > 0)
    ) {
      //  pipelienKind !== 'stream'
      cols.shift();
    }
    return cols;
  }, [algorithm.name, dataSource, isShowOneRow, payload.batchInfo, socketUrl]);

  return (
    <Table
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20'],
        hideOnSinglePage: true,
      }}
      rowKey={({ taskId }) => `input-output-table-task-${taskId}`}
      columns={tableColumns}
      dataSource={removeNullUndefinedCleanDeep(dataSource)}
      expandable={{
        defaultExpandAllRows: isShowOneRow,
        expandedRowRender: record => (
          <Card>
            <JsonSwitch obj={removeNullUndefinedCleanDeep(record)} />
          </Card>
        ),
        // eslint-disable-next-line react/prop-types
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          ),
      }}
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
  isShowOneRow: PropTypes.bool.isRequired,
};

export default React.memo(NodeInputOutput);
