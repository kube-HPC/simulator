import React from 'react';
import { StartTime, TagColoByName, DragHandle } from '../QueueOrderComponents';

export const TypeTableColumns = {
  JOBID: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'jobID',
      dataIndex: ['jobId'],
      className: 'drag-visible',
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
  ],
  PIPELINE: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Pipeline Name',
      dataIndex: ['name'],
      render: name => <b>{name}</b>,
    },
    {
      title: 'jobs Count',
      dataIndex: 'count',
    },
  ],
  TAG: [
    {
      title: '',
      dataIndex: ['sort'],
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Tags',
      dataIndex: ['name'],
      render: TagColoByName,
    },
    {
      title: 'jobs Count',
      dataIndex: ['count'],
    },
  ],
};
