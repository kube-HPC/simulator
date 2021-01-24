import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { fetchDataSource } from './../../../actions/dataSources';
import usePath from './usePath';

/** @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus */

const useActiveDataSource = () => {
  const dispatch = useDispatch();
  const { dataSourceId } = usePath();
  const dataSource = useSelector(state =>
    selectors.dataSources.byId(state, dataSourceId)
  );

  const collectionStatus = useSelector(selectors.dataSources.status);

  useEffect(() => {
    if (collectionStatus !== 'SUCCESS') return;
    if (dataSource?.status === 'FAIL') return;
    if (dataSource?.status === 'IDLE') {
      dispatch(fetchDataSource(dataSource));
    }
    if (!dataSource) {
      dispatch(fetchDataSource({ id: dataSourceId }));
    }
  }, [dispatch, dataSource, collectionStatus, dataSourceId]);

  /** @type {FetchStatus | 'NOT_FOUND'} */
  const status =
    collectionStatus === 'SUCCESS'
      ? dataSource
        ? dataSource.status
        : 'PENDING'
      : collectionStatus;

  return {
    dataSource,
    status,
    isReady: status === 'SUCCESS',
  };
};

export default useActiveDataSource;
