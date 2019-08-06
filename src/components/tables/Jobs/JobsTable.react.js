import React from 'react';
import { useSelector } from 'react-redux';

import DynamicTable from 'components/Layout/DynamicTable.react';
import JobsTabSwitcher from 'components/tables/Jobs/JobsTabSwitcher.react';
import jobsTableColumns from 'components/tables/Jobs/JobsTableColumns.react';
import CardRow from 'components/common/CardRow.react';

import useJobs from 'hooks/useJobs.react';
import USER_GUIDE from 'constants/user-guide';

export default function JobsTable() {
  const { dataSource, dispatch, getJaegerData, jaeger } = useJobs();
  const { isOn: isGuideOn } = useSelector(state => state.userGuide);

  return (
    <DynamicTable
      columns={jobsTableColumns({ dispatch, isGuideOn })}
      dataSource={dataSource}
      expandedRowRender={record => {
        return (
          <CardRow className={isGuideOn && USER_GUIDE.TABLE_JOB.ROW_SELECT}>
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
        // Don't call api on guide mode
        expanded && !isGuideOn && getJaegerData(record.pipeline.jobId);
      }}
    />
  );
}
