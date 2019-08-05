import { useSelector } from 'react-redux';
import { getJaegerData } from 'actions/jobs.action';
import { STATE_SOURCES } from 'reducers/root.reducer';
import useDispatchCallback from './useDispatchMemo.react';
import { tableDataSelector } from 'utils/hooks';

const dataSelector = tableDataSelector(
  STATE_SOURCES.JOBS_TABLE,
  filter => row => row.key.includes(filter)
);

export default function useJobs() {
  const jaeger = useSelector(state => state.jobsJaeger);
  const dataSource = useSelector(dataSelector);
  const dispatch = useDispatchCallback();

  const dispatchGetJaeger = record => dispatch(getJaegerData(record));

  return {
    dataSource,
    dispatch,
    getJaegerData: dispatchGetJaeger,
    jaeger
  };
}
