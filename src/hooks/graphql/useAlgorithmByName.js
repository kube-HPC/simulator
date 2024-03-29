const { useQuery } = require('@apollo/client');
const { ALGORITHM_BY_NAME_QUERY } = require('../../graphql/queries');
// const {usePolling} =require('./usePolling')

const useAlgorithmByName = algorithmName =>
  useQuery(ALGORITHM_BY_NAME_QUERY, {
    variables: {
      name: algorithmName,
    },
  });
export default useAlgorithmByName;
