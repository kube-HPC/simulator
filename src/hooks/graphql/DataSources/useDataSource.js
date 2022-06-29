import { DATASOURCES_LIST_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useDataSource = () => {
  const query = useQuery(DATASOURCES_LIST_QUERY);
  usePolling(query, 12000);

  const dataSources = query.data?.dataSources || [];

  return {
    dataSources,
  };
};
export default useDataSource;
