import { useQuery } from '@apollo/client';
import { ALGORITHM_BY_VERSION_QUERY } from '../../graphql/queries';

const useAlgorithmByVersion = (algorithmName, algorithmVersion) =>
  useQuery(ALGORITHM_BY_VERSION_QUERY, {
    variables: {
      name: algorithmName || '',
      version: algorithmVersion || '',
    },
  });
export default useAlgorithmByVersion;
