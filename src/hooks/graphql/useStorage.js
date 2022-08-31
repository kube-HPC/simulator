import { DISK_SPACE_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useStorage = () => {
  const query = useQuery(DISK_SPACE_QUERY);

  usePolling(query, 12000);

  const storage = query?.data?.diskSpace || [];

  return {
    storage,
  };
};
export default useStorage;
