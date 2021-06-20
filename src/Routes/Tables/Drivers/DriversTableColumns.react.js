import React from 'react';
import Ellipsis from 'components/common/Ellipsis.react';
import { Count as CountTag } from 'components/StatusTag';

const DriverId = driverId => <Ellipsis text={driverId} />
const PodName = podName => <Ellipsis copyable text={podName} />;
const Status = status => <Ellipsis text={status} />
const Jobs = jobs => <CountTag count={jobs.length} />
const Max = count => <CountTag count={count} />
const Capacity = count => <CountTag count={count} />
const JobId = jobId => <Ellipsis text={jobId} />
const Active = active => <Ellipsis text={active ? 'active' : 'inActive'} />

export const driverJobsTableColumns = [
  {
    title: 'jobId',
    key: 'jobId',
    dataIndex: 'jobId',
    width: '40%',
    render: JobId,
  },
  {
    title: 'active',
    key: 'active',
    dataIndex: 'active',
    width: '60%',
    render: Active,
  },
];

export const driversTableColumns = [
  {
    title: 'Driver Id',
    key: 'driverId',
    dataIndex: 'driverId',
    width: '20%',
    render: DriverId,
  },
  {
    title: 'Pod Name',
    key: 'podName',
    dataIndex: 'podName',
    width: '20%',
    render: PodName,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    width: '15%',
    render: Status,
  },
  {
    title: 'Current Jobs',
    key: 'jobs',
    dataIndex: 'jobs',
    width: '15%',
    render: Jobs,
  },
  {
    title: 'Max Jobs',
    key: 'max',
    dataIndex: 'max',
    width: '15%',
    render: Max,
  },
  {
    title: 'Total Capacity',
    key: 'capacity',
    dataIndex: 'capacity',
    width: '15%',
    render: Capacity,
  },
];
