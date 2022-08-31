import { DATASOURCE_SNAPANSHOTS_QUERY } from 'graphql/queries';
// import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useSnapshots = ({ dataSourceName }) => {
  const query = useQuery(DATASOURCE_SNAPANSHOTS_QUERY, {
    variables: {
      name: dataSourceName || '',
    },
  });
  // usePolling(query, 3000);

  const isReady = 'SUCCESS';
  const snapshots = query?.data?.DataSourceSnapanshots;

  return {
    snapshots,
    isReady,
  };
};
export default useSnapshots;
