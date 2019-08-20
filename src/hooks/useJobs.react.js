import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJaegerData as _getJaegerData } from 'actions/jobs.action';
import { tableDataSelector } from 'utils/hooks';
import { useCallback, useMemo } from 'react';
import { isEqual } from 'lodash';

import Card from 'components/common/Card.react';
import { STATE_SOURCES, USER_GUIDE } from 'const';
import { JobsTabSwitcher, getJobsColumns } from 'components/Tables/Jobs';

const dataSelector = tableDataSelector(STATE_SOURCES.JOBS_TABLE, filter => row =>
  row.key.includes(filter)
);

export default function useJobs() {
  const { isOn } = useSelector(state => state.userGuide, isEqual);
  const dispatch = useDispatch();

  const getJaegerData = useCallback(record => dispatch(_getJaegerData(record)), [dispatch]);

  const columns = useMemo(() => getJobsColumns({ dispatch, isGuideOn: isOn }), [dispatch, isOn]);

  const onExpand = useCallback(
    (expanded, record) => {
      expanded && getJaegerData(record.pipeline.jobId);
    },
    [getJaegerData]
  );

  const jaeger = useSelector(state => state.jobsJaeger);
  const expandedRowRender = useCallback(
    record => (
      <Card className={USER_GUIDE.TABLE_JOB.ROW_SELECT}>
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
      </Card>
    ),
    [jaeger]
  );

  const dataSource = useSelector(dataSelector);

  return {
    dataSource,
    columns,
    expandedRowRender,
    onExpand
  };
}
