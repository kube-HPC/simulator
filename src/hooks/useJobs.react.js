import { getJobsColumns } from 'components/Tables/Jobs';
import { LEFT_SIDEBAR_NAMES } from 'const';
import isEqual from 'lodash/isEqual';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStore } from 'reusable';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.JOBS);

const useJobs = () => {
  const { isOn } = useSelector(state => state.userGuide, isEqual);
  const dispatch = useDispatch();
  const columns = useMemo(() => getJobsColumns({ dispatch, isGuideOn: isOn }), [dispatch, isOn]);

  const dataSource = useSelector(dataSelector, isEqual);

  return {
    dataSource,
    columns,
  };
};

export default createStore(useJobs);
