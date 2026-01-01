/* eslint-disable react/prop-types */
import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { FireFilled, PauseCircleTwoTone } from '@ant-design/icons';
import { Tag, Tooltip, Space } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import { StatusTag as CountTag } from 'components/StatusTag';
import React, { useCallback } from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter, toUpperCaseFirstLetter } from 'utils/stringHelper';
import { ReactComponent as IconAddPipeline } from 'images/forward-arrow-icon.svg';
import WorkersActions from './WorkersActions.react';
import usePathAlgorithm from '../Algorithms/usePath';

const iconSize = {
  width: '20px',
  height: '20px',
  marginLeft: '5px',
  opacity: 0.6,
  cursor: 'pointer',
};

const undefinedStateFilter = state => state || 'Creating';
const Actions = algorithm => <WorkersActions algorithm={algorithm} />;

const WorkerState = (_, { workerStatus, jobStatus }) => {
  const title = toUpperCaseFirstLetter(undefinedStateFilter(workerStatus));
  return (
    <>
      <Tag color={COLOR_TASK_STATUS[workerStatus]}>{title}</Tag>
      <Tag color={COLOR_TASK_STATUS[jobStatus]}>{`Job ${title}`}</Tag>
    </>
  );
};

const HotWorker = (_, { workerPaused, hotWorker }) => (
  <>
    {workerPaused && (
      <Tooltip placement="top" title="Stop Worker">
        <PauseCircleTwoTone twoToneColor="red" />
      </Tooltip>
    )}
    {hotWorker && (
      <Tooltip placement="top" title="Hot Worker">
        <FireFilled style={{ color: 'orange' }} />
      </Tooltip>
    )}
  </>
);

const PodName = podName => <Ellipsis copyable text={podName} length={65} />;

const JobId = jobId => {
  const isValidJobId = jobId !== undefined;
  const type = !isValidJobId ? 'warning' : '';
  const text = jobId || 'Not Assigned';

  return <Ellipsis type={type} copyable={isValidJobId} text={text} />;
};

export const workersTableStats = [
  {
    title: '',
    dataIndex: ['workerStatus'],
    key: 'workerStatusIcon',
    render: HotWorker,
  },
  {
    title: 'Pod Name',
    dataIndex: ['podName'],
    key: 'podName',
    onFilter: (value, record) => record.podName.includes(value),
    render: PodName,
    sorter: (a, b) => sorter(a.podName, b.podName),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Worker State',
    dataIndex: ['workerStatus'],
    key: 'workerStatus',
    render: WorkerState,
  },
  {
    title: 'Job ID',
    dataIndex: ['jobId'],
    key: 'jobId',
    render: JobId,
  },
];

const toNum = text => (text && parseInt(text, 10)) || 0;

const Name = name => <Ellipsis text={name} />;
const ReadyCount = text => (
  <CountTag status={PIPELINE_STATUS.PENDING} count={toNum(text)} />
);
const WorkingCount = text => (
  <CountTag status={PIPELINE_STATUS.ACTIVE} count={toNum(text)} />
);
const InitCount = text => (
  <CountTag status={PIPELINE_STATUS.INIT} count={toNum(text)} />
);
const ExitCount = text => (
  <CountTag status={PIPELINE_STATUS.STOPPED} count={toNum(text)} />
);
// Create a proper React component for HotCount
const HotCountComponent = ({ text, record }) => {
  const { goTo: goToAlgorithm } = usePathAlgorithm();

  const editByAlgorithmName = useCallback(
    () =>
      goToAlgorithm.edit({
        nextAlgorithmId: record.algorithmName,
        openAdvanced: true,
      }),
    [goToAlgorithm, record.algorithmName]
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CountTag status={PIPELINE_STATUS.COMPLETED} count={toNum(text)} />
      <Space.Compact>
        <Tooltip title={`Edit algorithm ${record.algorithmName}`}>
          <IconAddPipeline style={iconSize} onClick={editByAlgorithmName} />
        </Tooltip>
      </Space.Compact>
    </div>
  );
};

// Render function that returns the component
const HotCount = (text, record) => (
  <HotCountComponent text={text} record={record} />
);
const Count = text => (
  <CountTag status={PIPELINE_STATUS.COMPLETED} count={toNum(text)} />
);

export const workersColumns = [
  {
    title: 'Algorithm Name',
    key: 'algorithmName',
    dataIndex: ['algorithmName'],
    sorter: (a, b) => sorter(a.algorithmName, b.algorithmName),
    defaultSortOrder: 'ascend',
    render: Name,
  },
  {
    title: 'Ready Count',
    key: 'readyCount',
    dataIndex: ['ready'],
    render: ReadyCount,
  },
  {
    title: 'Working Count',
    key: 'workingCount',
    dataIndex: ['working'],
    render: WorkingCount,
  },
  {
    title: 'Init Count',
    key: 'initCount',
    dataIndex: ['init'],
    render: InitCount,
  },
  {
    title: 'Exit Count',
    key: 'exitCount',
    dataIndex: ['exit'],
    render: ExitCount,
  },
  {
    title: 'Hot Count',
    key: 'hotCount',
    dataIndex: ['hot'],
    render: HotCount,
  },
  {
    title: 'Count',
    key: 'count',
    dataIndex: ['count'],
    render: Count,
  },
  {
    title: 'Actions',
    key: 'hotActions',
    render: Actions,
  },
];
