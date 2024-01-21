import PropTypes from 'prop-types';
import { removeNullUndefinedCleanDeep } from 'utils';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { Table } from 'antd';
import { Card, JsonSwitch } from 'components/common';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import getColumns from './getColumns';
import FilterByStatusTable from './FilterByStatusTable';

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
  modeSelect,
  setCurrentTask,
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

  const statusCount = useMemo(() => countByKey(dataSource, 'status'), [
    dataSource,
  ]);

  const tableColumns = useMemo(() => {
    const cols = getColumns(
      socketUrl,
      algorithm.name,
      statusCount,
      isShowOneRow,
      modeSelect
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
  }, [
    algorithm.name,
    isShowOneRow,
    modeSelect,
    payload.batchInfo,
    socketUrl,
    statusCount,
  ]);

  const [filterDataSource, setFilterDataSource] = useState(dataSource);
  const onFilterStatus = useCallback(
    statusArray => {
      if (statusArray.length > 0) {
        setFilterDataSource(
          dataSource.filter(obj => statusArray.includes(obj.status))
        );
      } else {
        setFilterDataSource(dataSource);
      }
    },
    [dataSource]
  );

  return (
    <>
      <FilterByStatusTable
        OnFilter={onFilterStatus}
        isShowOneRow={isShowOneRow}
        statusCount={statusCount}
      />

      <Table
        rowClassName={() => (modeSelect ? 'cursor-pointer' : '')}
        style={{ width: modeSelect ? '35vw' : '', marginTop: '10px' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20'],
          hideOnSinglePage: true,
        }}
        rowKey={({ taskId }) => `input-output-table-task-${taskId}`}
        columns={tableColumns}
        dataSource={removeNullUndefinedCleanDeep(filterDataSource)}
        expandable={
          !modeSelect && {
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
          }
        }
        onRow={record =>
          modeSelect && {
            onClick: () => {
              // eslint-disable-next-line react/prop-types
              const { taskId } = record;
              setCurrentTask(taskId);
            },
          }
        }
      />
    </>
  );
};
NodeInputOutput.defaultProps = { modeSelect: false };
NodeInputOutput.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  payload: PropTypes.object.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  algorithm: PropTypes.object.isRequired,
  isShowOneRow: PropTypes.bool.isRequired,
  modeSelect: PropTypes.bool,
  setCurrentTask: PropTypes.func.isRequired,
};

export default React.memo(NodeInputOutput);
