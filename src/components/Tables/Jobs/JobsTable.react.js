import React from 'react';
import JobInfo from './JobInfo.react';
import { useJobs, useActions } from 'hooks';
import { DRAWER_SIZE } from 'const';
import { Table } from 'components';

const JobsTable = () => {
  const { columns, dataSource } = useJobs();
  const { drawerOpen } = useActions();

  const onRow = job => ({
    onDoubleClick: () => {
      const {
        pipeline: { name },
      } = job;
      const body = <JobInfo job={job} />;
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
