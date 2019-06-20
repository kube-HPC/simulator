import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { getJaegerData } from 'actions/jobs.action';

import InfinityTable from 'components/UI/Layout/InfinityTable.react';
import JobsTabSwitcher from 'components/UI/tables/Jobs/JobsTabSwitcher.react';
import jobsTableColumns from 'components/UI/tables/Jobs/JobsTableColumns.react';
import CardRow from 'components/containers/CardRow.react';

const tableDataSelector = createSelector(
  state => state.jobsTable.dataSource,
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource && dataSource.asMutable().filter(row => row.key.includes(filter))
);

export default function JobsTable() {
  const jaeger = useSelector(state => state.jaeger);
  const dataSource = useSelector(state => tableDataSelector(state));
  const dispatch = useDispatch();

  return (
    <InfinityTable
      columns={jobsTableColumns(dispatch)}
      dataSource={dataSource}
      expandedRowRender={record => (
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
      )}
      onExpand={(_, { key }) => dispatch(getJaegerData(key))}
    />
  );
}
