const { useQuery } = require('@apollo/client');
const { ALGORITHM_BY_NAME_QUERY } = require('../../qraphql/queries');
// const {usePolling} =require('./usePolling')

const useAlgorithmByName = algorithmName =>
  useQuery(ALGORITHM_BY_NAME_QUERY, {
    variables: {
      algorithmName,
    },
  });
export default useAlgorithmByName;
