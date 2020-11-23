import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import usePath from './usePath';

export default () => {
  const { algorithmId } = usePath();

  const algorithmBase = useSelector(state =>
    selectors.algorithms.collection.byId(state, algorithmId)
  );
  const algorithmBuild = useSelector(state =>
    selectors.algorithms.builds.byId(state, algorithmId)
  );

  const activeAlgorithm = useMemo(
    () => (algorithmBase ? { ...algorithmBase, builds: algorithmBuild } : null),
    [algorithmBase, algorithmBuild]
  );

  return {
    activeAlgorithm,
    algorithmId,
  };
};
