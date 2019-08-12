import React, { useState } from 'react';
import DynamicTable from 'components/Layout/DynamicTable.react';
import useJobs from 'hooks/useJobs.react';
import { chunk } from 'lodash';

import Immutable from 'seamless-immutable';
import { useSelector } from 'react-redux';

import USER_GUIDE, { userGuideStepIndexes } from 'constants/user-guide';
import { jobsTableMock } from 'config/template/user-guide.template';

const DEFAULT_PAGE_SIZE = 20;
const mockDataSource = Immutable.from(jobsTableMock);

const expendIndex = userGuideStepIndexes.findIndex(
  step => step === USER_GUIDE.TABLE_JOB.MENU_SELECT
);

const expandLast = stepIndex =>
  stepIndex >= expendIndex ? [mockDataSource[mockDataSource.length - 1].key] : [];
const areSameOnIndex = (a, b) => a.stepIndex !== expendIndex && a.isOn === b.isOn;

const JobsTable = () => {
  const { columns, dataSource, expandedRowRender, onExpand } = useJobs();

  const [currentPage, setCurrentPage] = useState(1);
  const onChange = ({ current }) => setCurrentPage(current);

  const chunks = chunk(dataSource, DEFAULT_PAGE_SIZE);
  const pagination = { total: dataSource.length, pageSize: DEFAULT_PAGE_SIZE };

  const { isOn, stepIndex } = useSelector(state => state.userGuide, areSameOnIndex);

  const tableDataSource = isOn ? mockDataSource : chunks[currentPage - 1];
  const expandedRowKeys = isOn ? { expandedRowKeys: expandLast(stepIndex) } : {};

  return (
    <DynamicTable
      current={currentPage}
      onChange={onChange}
      columns={columns}
      dataSource={tableDataSource}
      expandedRowRender={expandedRowRender}
      onExpand={onExpand}
      pagination={pagination}
      {...expandedRowKeys}
    />
  );
};

export default JobsTable;
