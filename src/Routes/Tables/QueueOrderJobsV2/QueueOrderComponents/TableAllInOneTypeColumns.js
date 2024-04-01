import React from 'react';
import FlexBox from 'components/common/FlexBox.react';
import {
  TypeRow,
  StartTime,
  TagColoByName,
  Concurrency,
  ActionsQueueOrder,
} from '../QueueOrderComponents';

const Actions = (_, job) => <ActionsQueueOrder job={job} />;
const Status = (_, job) => (
  <FlexBox justify="flex-start" gutter={0}>
    <Concurrency isConcurrency={job.maxExceeded} />
    &nbsp;&nbsp;
    <TypeRow type={job.typeElement} />
  </FlexBox>
);

export const TableAllInOneTypeColumns = {
  JOBID: [
    {
      title: 'jobID',
      dataIndex: ['jobId'],
    },
    {
      title: 'Start Time',
      dataIndex: ['entranceTime'],
      key: `Start timestamp`,

      render: StartTime,
    },
    {
      title: 'Name',
      dataIndex: ['pipelineName'],
    },
    {
      title: 'Tags',
      dataIndex: ['tags'],
      render: TagColoByName,
    },

    {
      title: 'Actions',
      width: '8%',
      render: Actions,
    },
    {
      title: 'Status',
      width: '8%',
      render: Status,
    },
  ],

  PIPELINE: [
    {
      title: 'Pipeline Name',
      dataIndex: ['name'],
      render: name => <b>{name}</b>,
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
    {
      title: 'Status',
      width: '8%',
      render: Status,
    },
  ],
  TAG: [
    {
      title: 'Tags',
      dataIndex: ['name'],
      render: TagColoByName,
    },
    {
      title: 'jobs Count',
      dataIndex: ['count'],
    },
    {
      title: 'Status',
      width: '8%',
      render: Status,
    },
  ],
};
