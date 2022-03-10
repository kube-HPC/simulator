import React from 'react';
import Ellipsis from 'components/common/Ellipsis.react';
import { StatusTag as CountTag } from 'components/StatusTag';
import { sorter } from 'utils/stringHelper';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const DriverId = driverId => <Ellipsis text={driverId} />;
const PodName = podName => <Ellipsis copyable text={podName} />;
const Status = status => <Ellipsis text={status} />;
const Jobs = jobs => <CountTag count={jobs.length} />;
const Max = count => <CountTag count={count} />;
const Capacity = count => <CountTag count={count} />;
const TextFilter = itemValue => {
  const filter = useSelector(selectors.autoCompleteFilter);
  return (
    <Ellipsis className={filter === itemValue ? 'mark' : ''}>
      {itemValue}
    </Ellipsis>
  );
};

const Active = active => <Ellipsis text={active ? 'active' : 'inActive'} />;
const sortDriverId = (a, b) => sorter(a.driverId, b.driverId);

export const driverJobsTableColumns = [
  {
    title: 'jobId',
    key: 'jobId',
    dataIndex: ['jobId'],
    width: '40%',
    render: TextFilter,
  },
  {
    title: 'Pipeline Name',
    key: 'pipelineName',
    dataIndex: ['pipelineName'],
    width: '40%',
    render: TextFilter,
  },
  {
    title: 'active',
    key: 'active',
    dataIndex: ['active'],
    width: '20%',
    render: Active,
  },
];

export const driversTableColumns = [
  {
    title: 'Driver Id',
    key: 'driverId',
    dataIndex: ['driverId'],
    width: '20%',
    render: DriverId,
    sorter: sortDriverId,
    defaultSortOrder: 'descend',
  },
  {
    title: 'Pod Name',
    key: 'podName',
    dataIndex: ['podName'],
    width: '20%',
    render: PodName,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: ['status'],
    width: '15%',
    render: Status,
  },
  {
    title: 'Current Jobs',
    key: 'jobs',
    dataIndex: ['jobs'],
    width: '15%',
    render: Jobs,
  },
  {
    title: 'Max Jobs',
    key: 'max',
    dataIndex: ['max'],
    width: '15%',
    render: Max,
  },
  {
    title: 'Total Capacity',
    key: 'capacity',
    dataIndex: ['capacity'],
    width: '15%',
    render: Capacity,
  },
];
