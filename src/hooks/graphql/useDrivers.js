import { DRIVERS_ALL_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useDrivers = () => {
  const query = useQuery(DRIVERS_ALL_QUERY);
  usePolling(query, 3000);

  const collection =
    (query.data?.discovery && query.data?.discovery.pipelineDriver) || [];

  return {
    collection,
  };
};
export default useDrivers;
