import { useMemo } from 'react';
import {
  ALGORITHM_BY_NAME_QUERY,
  ALGORITHM_BUILDS_FRAGMENTS,
} from 'graphql/queries';
import { useQuery } from '@apollo/client';
import usePath from './usePath';

export default () => {
  const { algorithmId } = usePath();

  const queryAlgorithmsByName = useQuery(ALGORITHM_BY_NAME_QUERY, {
    variables: {
      name: algorithmId,
    },
  });
  const algorithmBase = queryAlgorithmsByName.data?.algorithmsByName;
  const queryAlgorithmBuilds = useQuery(ALGORITHM_BUILDS_FRAGMENTS, {
    variables: {
      algorithmName: algorithmId,
    },
  });
  const algorithmBuild = queryAlgorithmBuilds.data?.algorithmBuilds;

  const activeAlgorithm = useMemo(
    () => (algorithmBase ? { ...algorithmBase, builds: algorithmBuild } : null),
    [algorithmBase, algorithmBuild]
  );

  return {
    activeAlgorithm,
    algorithmId,
  };
};
