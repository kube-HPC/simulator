import { useQuery } from '@apollo/client';
import { ALGORITHM_BY_NAME_QUERY } from '../../graphql/queries';

const useAlgorithmByName = algorithmName =>
  useQuery(ALGORITHM_BY_NAME_QUERY, {
    variables: {
      name: algorithmName,
    },
  });
export default useAlgorithmByName;
