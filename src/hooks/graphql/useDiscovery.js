const { useQuery } = require('@apollo/client');
const { DISCOVERY_QUERY } = require('../../graphql/queries');

const useDiscovery = () => useQuery(DISCOVERY_QUERY);
export default useDiscovery;
