import { useSelector } from 'react-redux';
import { getJaegerData } from 'actions/jobs.action';
import tableDataSelector from 'utils/tableDataSelector';
import { sourcesNames } from 'reducers/root.reducer';
import useDispatchCallback from './useDispatchMemo.react';

const dataSelector = tableDataSelector(sourcesNames.JOBS_TABLE, filter => row =>
  row.key.includes(filter)
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
