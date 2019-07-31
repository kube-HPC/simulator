import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { getJaegerData } from 'actions/jobs.action';

import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import JobsTabSwitcher from 'components/UI/tables/Jobs/JobsTabSwitcher.react';
import jobsTableColumns from 'components/UI/tables/Jobs/JobsTableColumns.react';
import CardRow from 'components/common/CardRow.react';

const tableDataSelector = createSelector(
  state => state.jobsTable.dataSource.asMutable(),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.filter(row => row.key.includes(filter))
);

const mockDataSource = [];
const isGuideOn = false;

export default function JobsTable() {
  const jaeger = useSelector(state => state.jobsJaeger);
  const dataSource = useSelector(tableDataSelector);
  const dispatch = useDispatch();

  return (
    <DynamicTable
      columns={jobsTableColumns(dispatch)}
      dataSource={isGuideOn ? mockDataSource : dataSource}
      expandedRowRender={record => {
        return (
          <CardRow>
            <JobsTabSwitcher
              record={{
                key: record.key,
                graph: record.graph,
                record: {
                  pipeline: record.pipeline,
                  status: record.status,
                  results: record.results
                },
                jaeger: jaeger[record.key] || null
              }}
            />
          </CardRow>
        );
      }}
      onExpand={(expanded, record) => {
        expanded &&
          !isGuideOn &&
          dispatch(getJaegerData(record.pipeline.jobId));
      }}
    />
  );
}
