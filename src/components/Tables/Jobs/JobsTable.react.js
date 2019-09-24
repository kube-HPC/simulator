import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import chunk from 'lodash/chunk';
import Immutable from 'seamless-immutable';

import { useJobs } from 'hooks';
import { userGuideStepIndexes, USER_GUIDE } from 'const';
import { jobsTableMock } from 'config';
import { Table } from 'components';

const DEFAULT_PAGE_SIZE = 20;
const mockDataSource = Immutable.from(jobsTableMock);

const expendIndex = userGuideStepIndexes.findIndex(
  step => step === USER_GUIDE.TABLE_JOB.MENU_SELECT
);

const expandLast = stepIndex =>
  stepIndex >= expendIndex ? [mockDataSource[mockDataSource.length - 1].key] : [];
const areSameOnIndex = (a, b) => a.stepIndex !== expendIndex && a.isOn === b.isOn;

const JobsTable = () => {
  const { columns, dataSource, expandedRowRender } = useJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const onChange = ({ current }) => setCurrentPage(current);

  const chunks = chunk(dataSource, DEFAULT_PAGE_SIZE);
  const pagination = { total: dataSource.length, pageSize: DEFAULT_PAGE_SIZE };

  const { isOn, stepIndex } = useSelector(state => state.userGuide, areSameOnIndex);

  const tableDataSource = isOn ? mockDataSource : chunks[currentPage - 1] || [];
  const expandedRowKeys = isOn ? { expandedRowKeys: expandLast(stepIndex) } : {};

  return (
    <Table
      current={currentPage}
      onChange={onChange}
      columns={columns}
      dataSource={tableDataSource}
      expandedRowRender={expandedRowRender}
      pagination={pagination}
      {...expandedRowKeys}
    />
  );
};

export default React.memo(JobsTable);
