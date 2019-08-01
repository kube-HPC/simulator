import React from 'react';
import { useSelector } from 'react-redux';

import DynamicTable from 'components/UI/Layout/DynamicTable.react';
import JobsTabSwitcher from 'components/UI/tables/Jobs/JobsTabSwitcher.react';
import jobsTableColumns from 'components/UI/tables/Jobs/JobsTableColumns.react';
import CardRow from 'components/common/CardRow.react';

import useJobs from 'hooks/useJobs.react';
import { jobsTableMock } from 'config/template/user-guide.template';
import Immutable from 'seamless-immutable';
import USER_GUIDE from 'constants/user-guide';

const mockDataSource = Immutable(jobsTableMock);

export default function JobsTable() {
  const { dataSource, dispatch, getJaegerData, jaeger } = useJobs();
  const { isOn: isGuideOn } = useSelector(state => state.userGuide);

  return (
    <DynamicTable
      columns={jobsTableColumns({ dispatch, isGuideOn })}
      dataSource={isGuideOn ? mockDataSource : dataSource}
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
