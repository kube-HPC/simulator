import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Icon, Tag } from 'antd';
import Ellipsis from 'components/common/Ellipsis.react';
import StatusTag from 'components/common/StatusTag.react';
import React from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { sorter, toUpperCaseFirstLetter } from 'utils/string';

const undefinedStateFilter = state => state || 'Creating';

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
      <Icon type="pause-circle" theme="twoTone" twoToneColor="red" />
    )}
    {hotWorker && (
      <Icon type="fire" theme="filled" style={{ color: 'orange' }} />
    )}
  </>
);

const PodName = podName => <Ellipsis copyable text={podName} />;

const JobId = jobId => {
  const isValidJobId = jobId !== undefined;
  const type = !isValidJobId && 'warning';
  const text = jobId || 'Not Assigned';

  return <Ellipsis type={type} copyable={isValidJobId} text={text} />;
};

export const workersTableStats = () => [
  {
    title: '',
    dataIndex: 'workerStatus',
    key: 'workerStatusIcon',
    render: HotWorker,
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    key: 'podName',
    onFilter: (value, record) => record.podName.includes(value),
    render: PodName,
    sorter: (a, b) => sorter(a.podName, b.podName),
    sortOrder: 'ascend',
  },
  {
    title: 'Worker State',
    dataIndex: 'workerStatus',
    key: 'workerStatus',
    render: WorkerState,
  },
  {
    title: 'Job ID',
    dataIndex: 'jobId',
    key: 'jobId',
    render: JobId,
  },
];

const toNum = text => (text && parseInt(text, 10)) || 0;

const Name = name => <Ellipsis text={name} />;
const ReadyCount = text => (
  <StatusTag status={PIPELINE_STATUS.PENDING} count={toNum(text)} />
);
const WorkingCount = text => (
  <StatusTag status={PIPELINE_STATUS.ACTIVE} count={toNum(text)} />
);
const InitCount = text => (
  <StatusTag status={PIPELINE_STATUS.INIT} count={toNum(text)} />
);
const ExitCount = text => (
  <StatusTag status={PIPELINE_STATUS.STOPPED} count={toNum(text)} />
);
const HotCount = text => (
  <StatusTag status={PIPELINE_STATUS.COMPLETED} count={toNum(text)} />
);
const Count = text => (
  <StatusTag status={PIPELINE_STATUS.COMPLETED} count={toNum(text)} />
);

export const getWorkersColumns = () => [
  {
    title: 'Algorithm Name',
    key: 'algorithmName',
    dataIndex: 'algorithmName',
    sorter: (a, b) => sorter(a.algorithmName, b.algorithmName),
    sortOrder: 'ascend',
    render: Name,
  },
  {
    title: 'Ready Count',
    key: 'readyCount',
    dataIndex: 'ready',
    render: ReadyCount,
  },
  {
    title: 'Working Count',
    key: 'workingCount',
    dataIndex: 'working',
    render: WorkingCount,
  },
  {
    title: 'Init Count',
    key: 'initCount',
    dataIndex: 'init',
    render: InitCount,
  },
  {
    title: 'Exit Count',
    key: 'exitCount',
    dataIndex: 'exit',
    render: ExitCount,
  },
  {
    title: 'Hot Count',
    key: 'hotCount',
    dataIndex: 'hot',
    render: HotCount,
  },
  {
    title: 'Count',
    key: 'count',
    dataIndex: 'count',
    render: Count,
  },
];
