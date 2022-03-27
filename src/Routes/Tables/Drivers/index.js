import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'components';
import { Card } from 'components/common';
import { selectors } from 'reducers';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useFilter } from 'hooks/useSearch';
import {
  driversTableColumns,
  driverJobsTableColumns,
} from './DriversTableColumns.react';
import DriverLogs from './DriverLogs';

const ExpandedRow = (collection, filterValue) => record => {
  const { driverId, podName } = record;
  const driver = collection.find(c => c.driverId === driverId);
  const jobs =
    (filterValue &&
      podName !== filterValue &&
      driver?.jobs.filter(
        job =>
          job.jobId.indexOf(filterValue) !== -1 ||
          job.pipelineName.indexOf(filterValue) !== -1
      )) ||
    driver?.jobs ||
    [];

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
  const collection = useSelector(selectors.drivers.all);
  const filtered = useFilter(collection, ['podName', 'jobs']);
  const filterValue = useSelector(selectors.autoCompleteFilter);

  return (
    <Table
      rowKey={record => record.driverId}
      columns={driversTableColumns}
      dataSource={filtered}
      expandable={{
        expandedRowRender: ExpandedRow(collection, filterValue),

        // eslint-disable-next-line react/prop-types
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <RightOutlined onClick={e => onExpand(record, e)} />
          ),
      }}
    />
  );
};

export default DriversTable;
