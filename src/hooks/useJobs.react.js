import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { createStore } from 'reusable';
import isEqual from 'lodash/isEqual';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { dataSelector, tableSelector } from 'utils/tableSelector';
import { jobColumns } from 'Routes/Tables/Jobs';

const { JOBS_TABLE } = STATE_SOURCES;

const { predicate } = tableSelector[LEFT_SIDEBAR_NAMES.JOBS];
const byTypes = ({ pipeline: { types } }) => {
  const { search } = window.location;
  const query = new URLSearchParams(search);
  const filters = query.getAll('filter');
  return filters.length === 0
    ? true
    : filters.every(tag => types.includes(tag));
};

const jobsSelector = createSelector(
  dataSelector(JOBS_TABLE),
  state => state.autoCompleteFilter.filter,
  (dataSource, filter) =>
    dataSource ? dataSource.filter(predicate(filter)).filter(byTypes) : []
);

const useJobs = () => {
  const dataSource = useSelector(jobsSelector, isEqual);
  const { loading } = useSelector(state => state[STATE_SOURCES.EXPERIMENTS]);

  return {
    dataSource,
    columns: jobColumns,
    loading: loading || !dataSource,
  };
};

export default createStore(useJobs);
