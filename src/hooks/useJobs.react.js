import { getJobsColumns } from 'components/Tables/Jobs';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import isEqual from 'lodash/isEqual';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStore } from 'reusable';
import { dataSelector, tableSelector } from 'utils/tableSelector';
import { selector } from 'utils';
import { createSelector } from 'reselect';

const { JOBS_TABLE, FILTER_TYPES } = STATE_SOURCES;

const { predicate } = tableSelector[LEFT_SIDEBAR_NAMES.JOBS];
const byTypes = filters => ({ pipeline: { types } }) => types.find(type => filters.includes(type));

const jobsSelector = createSelector(
  dataSelector(JOBS_TABLE),
  state => state.autoCompleteFilter.filter,
  selector(FILTER_TYPES),
  (dataSource, filter, types) =>
    dataSource && dataSource.filter(predicate(filter)).filter(byTypes(types)),
);

const useJobs = () => {
  const { isOn } = useSelector(state => state.userGuide, isEqual);
  const dispatch = useDispatch();
  const columns = useMemo(() => getJobsColumns({ dispatch, isGuideOn: isOn }), [dispatch, isOn]);

  const dataSource = useSelector(jobsSelector, isEqual);

  return {
    dataSource,
    columns,
  };
};

export default createStore(useJobs);
