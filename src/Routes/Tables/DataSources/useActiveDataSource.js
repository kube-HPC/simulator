import { useActions } from 'hooks';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import usePath from './usePath';

/** @typedef {import('reducers/dataSources/datasource').FetchStatus} FetchStatus */

const useActiveDataSource = () => {
  const { fetchDataSource } = useActions();
  const { dataSourceId } = usePath();
  const dataSource = useSelector(state =>
    selectors.dataSources.byId(state, dataSourceId)
  );

  const collectionStatus = useSelector(selectors.dataSources.status);

  useEffect(() => {
    if (collectionStatus !== 'SUCCESS') return;
    if (dataSource?.status === 'FAIL') return;
    if (dataSource?.status === 'IDLE') {
      fetchDataSource(dataSource);
    } else if (!dataSource) {
      fetchDataSource({ id: dataSourceId });
    }
  }, [fetchDataSource, dataSource, collectionStatus, dataSourceId]);

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
    collectionStatus,
    isReady: status === 'SUCCESS',
  };
};

export default useActiveDataSource;
