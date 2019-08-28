import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJaegerData as _getJaegerData } from 'actions/jobs.action';
import { tableFilterSelector } from 'utils/tableSelector';
import { useCallback, useMemo } from 'react';
import { isEqual } from 'lodash';

import { USER_GUIDE, LEFT_SIDEBAR_NAMES } from 'const';
import { JobsTabSwitcher, getJobsColumns } from 'components/Tables/Jobs';
import { Card } from 'components/common';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.JOBS);

const initialJobRecord = ({ record, jaeger }) => ({
  key: record.key,
  graph: record.graph,
  record: {
    pipeline: record.pipeline,
    status: record.status,
    results: record.results
  },
  jaeger: jaeger[record.key] || null
});

export default function useJobs() {
  const { isOn } = useSelector(state => state.userGuide, isEqual);
  const dispatch = useDispatch();

  const getJaegerData = useCallback(jobsId => dispatch(_getJaegerData(jobsId)), [dispatch]);
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
      <Card isMargin className={USER_GUIDE.TABLE_JOB.ROW_SELECT}>
        <JobsTabSwitcher record={initialJobRecord({ record, jaeger })} />
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
