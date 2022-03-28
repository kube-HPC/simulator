import React from 'react';
import {
  TypeRow,
  StartTime,
  TagColoByName,
  Concurrency,
} from '../QueueOrderComponents';

export const TableAllInOneTypeColumns = {
  JOBID: [
    {
      title: '',
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
    },
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
      dataIndex: ['maxExceeded'],
      render: Concurrency,
    },
  ],

  PIPELINE: [
    {
      title: '',
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
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
      dataIndex: ['typeElement'],
      width: '2%',
      render: TypeRow,
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
