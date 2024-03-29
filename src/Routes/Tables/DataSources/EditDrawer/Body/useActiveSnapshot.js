import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSnapshots } from 'hooks/graphql';
/** @param {{ dataSourceName: string }} props */
const useActiveSnapshot = ({ dataSourceName }) => {
  const { isReady, snapshots } = useSnapshots({ dataSourceName });
  const { snapshotName } = useParams();

  const activeSnapshot = useMemo(
    () =>
      snapshots && snapshotName && isReady
        ? // ? snapshots.collection.find(item => item.name === snapshotName)
          snapshots.find(item => item.name === snapshotName)
        : null,
    [isReady, snapshotName, snapshots]
  );

  return {
    snapshots,
    isReady,
    activeSnapshot,
    snapshotName,
  };
};

export default useActiveSnapshot;
