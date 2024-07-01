import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'components';
import { Card } from 'components/common';
import { selectors } from 'reducers';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useFilter } from 'hooks/useSearch';
import useDrivers from 'hooks/graphql/useDrivers';
import {
  driversTableColumns,
  driverJobsTableColumns,
} from './DriversTableColumns.react';
import DriverLogs from './DriverLogs';

const filterJobs = (driver, podName, filterValue) =>
  (filterValue &&
    podName !== filterValue &&
    driver?.jobs.filter(
      job =>
        job.jobId?.indexOf(filterValue) !== -1 ||
        job.pipelineName?.indexOf(filterValue) !== -1
    )) ||
  driver?.jobs ||
  [];

const ExpandedRow = (collection, filterValue) => record => {
  const { driverId, podName } = record;
  const driver = collection.find(c => c.driverId === driverId);
  const jobs = filterJobs(driver, podName, filterValue);

  return (
    <Card isMargin>
      <Table
        isInner
        rowKey={row => row.jobId}
        columns={driverJobsTableColumns}
        dataSource={jobs}
      />
      <DriverLogs driverId={driverId} podName={podName} />
    </Card>
  );
};

const DriversTable = () => {
  const { collection } = useDrivers();

  const filtered = useFilter(collection, ['podName', 'jobs']);
  const filterValue = useSelector(selectors.autoCompleteFilter);

  const expandIcon = ({ expanded, onExpand, record }) =>
    expanded ? (
      <DownOutlined onClick={e => onExpand(record, e)} />
    ) : (
      <RightOutlined onClick={e => onExpand(record, e)} />
    );

  return (
    <Table
      rowKey={record => record.driverId}
      columns={driversTableColumns}
      dataSource={filtered}
      expandable={{
        expandedRowRender: ExpandedRow(collection, filterValue),
        expandIcon,
      }}
    />
  );
};

export default DriversTable;
