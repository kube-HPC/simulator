import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSnapshots } from 'actions/dataSources';
import { selectors } from 'reducers';
import { useParams } from 'react-router-dom';

/** @param {{ dataSourceName: string }} props */
const useSnapshots = ({ dataSourceName }) => {
  const { snapshotName } = useParams();
  const dispatch = useDispatch();
  const snapshots = useSelector(state =>
    selectors.dataSources.snapshots(state, dataSourceName)
  );
  const isReady = snapshots?.status === 'SUCCESS';

  const activeSnapshot = useMemo(
    () =>
      snapshotName && isReady
        ? snapshots.collection.find(item => item.name === snapshotName)
        : null,
    [isReady, snapshotName, snapshots]
  );

  useEffect(() => {
    if (!snapshots) return;
    if (snapshots.status === 'IDLE')
      dispatch(fetchSnapshots({ name: dataSourceName }));
  }, [dispatch, dataSourceName, snapshots]);

  return {
    ...snapshots,
    isReady,
    activeSnapshot,
  };
};

export default useSnapshots;
