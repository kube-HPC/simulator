import { useQuery } from '@apollo/client';
import { DISCOVERY_QUERY } from '../../graphql/queries';

const useDiscovery = () => useQuery(DISCOVERY_QUERY);
export default useDiscovery;
