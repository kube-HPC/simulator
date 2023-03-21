const { useQuery } = require('@apollo/client');
const { ALGORITHM_BY_VERSION_QUERY } = require('../../graphql/queries');

const useAlgorithmByVersion = (algorithmName, algorithmVersion) =>
  useQuery(ALGORITHM_BY_VERSION_QUERY, {
    variables: {
      name: algorithmName || '',
      version: algorithmVersion || '',
    },
  });
export default useAlgorithmByVersion;
