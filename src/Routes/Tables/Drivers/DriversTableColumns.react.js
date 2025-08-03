import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from 'components/common/Ellipsis.react';
import { StatusTag as CountTag } from 'components/StatusTag';
import { sorter } from 'utils/stringHelper';

const Jobs = ({ jobs }) => <CountTag count={jobs?.length | 0} />;
Jobs.propTypes = {
  jobs: PropTypes.array.isRequired,
};
export default Jobs;

const DriverId = driverId => <Ellipsis text={driverId} />;
const PodName = podName => <Ellipsis copyable text={podName} length={40} />;
const Status = status => <Ellipsis text={status} />;
const Max = count => <CountTag count={count} />;
const Capacity = count => <CountTag count={count} />;
const Active = active => <Ellipsis text={active ? 'active' : 'inActive'} />;
const sortDriverId = (a, b) => sorter(a.driverId, b.driverId);

export const driverJobsTableColumns = [
  {
    title: 'jobId',
    key: 'jobId',
    dataIndex: ['jobId'],
    width: '40%',
  },
  {
    title: 'Pipeline Name',
    key: 'pipelineName',
    dataIndex: ['pipelineName'],
    width: '40%',
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
