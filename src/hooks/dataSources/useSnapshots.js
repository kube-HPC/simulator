import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSnapshots } from 'actions/dataSources';
import { selectors } from 'reducers';

/** @param {{ dataSourceName: string }} props */
const useSnapshots = ({ dataSourceName }) => {
  const dispatch = useDispatch();
  const snapshots = useSelector(state =>
    selectors.dataSources.snapshots(state, dataSourceName)
  );
  const isReady = snapshots?.status === 'SUCCESS';
  console.log({ dataSourceName });
  useEffect(() => {
    if (!snapshots) return;
    if (snapshots.status === 'IDLE')
      dispatch(fetchSnapshots({ name: dataSourceName }));
  }, [dispatch, dataSourceName, snapshots]);

  return {
    ...snapshots,
    isReady,
  };
};

export default useSnapshots;
