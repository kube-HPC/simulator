import { Table } from 'components';
import { DRAWER_SIZE } from 'const';
import { useActions, useJobs } from 'hooks';
import React from 'react';
import JobInfo from './JobInfo.react';

const JobsTable = () => {
  const { columns, dataSource } = useJobs();
  const { drawerOpen } = useActions();

  const onRow = job => ({
    onDoubleClick: () => {
      const {
        key,
        pipeline: { name },
      } = job;
      const body = <JobInfo jobId={key} />;
      drawerOpen({ title: name, body, width: DRAWER_SIZE.JOB_INFO });
    },
  });

  return (
    <Table
      onRow={onRow}
      expandIcon={false}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
};

export default React.memo(JobsTable);
