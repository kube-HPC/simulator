import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import chunk from 'lodash/chunk';
import Immutable from 'seamless-immutable';

import JobInfo from './JobInfo.react';

import { useJobs, useActions } from 'hooks';
import { userGuideStepIndexes, USER_GUIDE, DRAWER_SIZE } from 'const';
import { jobsTableMock } from 'config';
import { Table } from 'components';

const DEFAULT_PAGE_SIZE = 20;
const mockDataSource = Immutable.from(jobsTableMock);

const expendIndex = userGuideStepIndexes.findIndex(
  step => step === USER_GUIDE.TABLE_JOB.MENU_SELECT,
);

const areSameOnIndex = (a, b) => a.stepIndex !== expendIndex && a.isOn === b.isOn;

const JobsTable = () => {
  const { columns, dataSource } = useJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const onChange = ({ current }) => setCurrentPage(current);

  const chunks = chunk(dataSource, DEFAULT_PAGE_SIZE);
  const pagination = { total: dataSource.length, pageSize: DEFAULT_PAGE_SIZE };

  const { isOn } = useSelector(state => state.userGuide, areSameOnIndex);

  const tableDataSource = isOn ? mockDataSource : chunks[currentPage - 1] || [];

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
      current={currentPage}
      onChange={onChange}
      expandIcon={false}
      columns={columns}
      dataSource={tableDataSource}
      pagination={pagination}
    />
  );
};

export default React.memo(JobsTable);
