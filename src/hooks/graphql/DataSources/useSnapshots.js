import { useEffect, useState } from 'react';
import { DATASOURCE_SNAPANSHOTS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useSnapshots = ({ dataSourceName }) => {
  const [snapshots, setSnapshots] = useState([]);
  const query = useQuery(DATASOURCE_SNAPANSHOTS_QUERY, {
    variables: {
      name: dataSourceName || '',
    },
  });
  usePolling(query, 3000);

  const isReady = 'SUCCESS';

  useEffect(() => {
    const dataSourcesSnapanshots = query?.data?.DataSourceSnapanshots || [];
    if (dataSourcesSnapanshots != null && dataSourcesSnapanshots.length > 0) {
      setSnapshots(
        dataSourcesSnapanshots.slice().sort((a, b) => (b.id > a.id ? 1 : -1))
      );
    }
  }, [query?.data?.DataSourceSnapanshots]);

  return {
    snapshots,
    isReady,
  };
};
export default useSnapshots;
