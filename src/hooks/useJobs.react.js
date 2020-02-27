import { getJobsColumns } from 'components/Tables/Jobs';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import isEqual from 'lodash/isEqual';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { createStore } from 'reusable';
import { selector } from 'utils';
import { dataSelector, tableSelector } from 'utils/tableSelector';

const { JOBS_TABLE, FILTER_TYPES } = STATE_SOURCES;

const { predicate } = tableSelector[LEFT_SIDEBAR_NAMES.JOBS];
const byTypes = filters => ({ pipeline: { types } }) =>
  filters.length === 0 ? true : filters.every(tag => types.includes(tag));

const jobsSelector = createSelector(
  dataSelector(JOBS_TABLE),
  state => state.autoCompleteFilter.filter,
  selector(FILTER_TYPES),
  (dataSource, filter, types) =>
    dataSource && dataSource.filter(predicate(filter)).filter(byTypes(types)),
);

const useJobs = () => {
  const columns = useMemo(() => getJobsColumns(), []);
  const dataSource = useSelector(jobsSelector, isEqual);
  const { loading } = useSelector(state => state[STATE_SOURCES.EXPERIMENTS]);

  return {
    dataSource,
    columns,
    loading: loading || !dataSource,
  };
};

export default createStore(useJobs);
