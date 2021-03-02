import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from 'reducers';
import * as actions from '../../actions/dataSources';

export default () => {
  const dataSources = useSelector(selectors.dataSources.all);
  const status = useSelector(selectors.dataSources.status);
  const error = useSelector(selectors.dataSources.error);
  const dispatch = useDispatch();
  const isPending = status === 'PENDING';

  useEffect(() => {
    if (status === 'IDLE') dispatch(actions.fetchDataSources());
  }, [dispatch, status, isPending]);

  const reFetchAll = useCallback(() => dispatch(actions.fetchDataSources()), [
    dispatch,
  ]);

  const fetchDataSource = useCallback(
    name => dispatch(actions.fetchDataSource({ name })),
    [dispatch]
  );

  return {
    dataSources,
    isPending,
    error,
    reFetchAll,
    fetchDataSource,
    status,
  };
};
