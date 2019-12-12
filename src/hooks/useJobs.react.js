import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tableFilterSelector } from 'utils/tableSelector';
import isEqual from 'lodash/isEqual';

import { USER_GUIDE, LEFT_SIDEBAR_NAMES } from 'const';
import { JobsTabSwitcher, getJobsColumns } from 'components/Tables/Jobs';
import { Card } from 'components/common';
import { createStore } from 'reusable';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.JOBS);

const initialJobRecord = ({ record }) => ({
  key: record.key,
  graph: record.graph,
  record: {
    pipeline: record.pipeline,
    status: record.status,
    results: record.results,
  },
});

const useJobs = () => {
  const { isOn } = useSelector(state => state.userGuide, isEqual);
  const dispatch = useDispatch();
  const columns = useMemo(() => getJobsColumns({ dispatch, isGuideOn: isOn }), [dispatch, isOn]);

  const expandedRowRender = useCallback(
    record => (
      <Card isMargin className={USER_GUIDE.TABLE_JOB.ROW_SELECT}>
        <JobsTabSwitcher record={initialJobRecord({ record })} />
      </Card>
    ),
    [],
  );

  const dataSource = useSelector(dataSelector);

  return {
    dataSource,
    columns,
    expandedRowRender,
  };
};

export default createStore(useJobs);
