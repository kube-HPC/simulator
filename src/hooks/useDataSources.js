import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './../actions/dataSources';
import { selectors } from './../reducers/dataSources';

export default () => {
  const dataSources = useSelector(state => selectors.all(state.dataSources));
  const status = useSelector(state => selectors.status(state.dataSources));
  const error = useSelector(state => selectors.error(state.dataSources));

  const dispatch = useDispatch();
  const isPending = status === 'PENDING';

  useEffect(() => {
    if (status === 'IDLE') dispatch(actions.fetchDataSources());
  }, [dispatch, status, isPending]);

  const reFetchAll = useCallback(() => dispatch(actions.fetchDataSources()), [
    dispatch,
  ]);

  useEffect(() => {
    reFetchAll();
  }, [reFetchAll]);

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
  };
};
