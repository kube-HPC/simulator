import { useEffect, useState } from 'react';
import { DATASOURCE_VERSIONS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useVersions = dataSource => {
  const [versionsCollection, setVersionsCollection] = useState([]);
  const query = useQuery(DATASOURCE_VERSIONS_QUERY, {
    variables: {
      name: dataSource?.name || '',
    },
  });
  usePolling(query, 3000);

  useEffect(() => {
    const dataSourcesVersions = query.data?.DataSourceVersions || [];

    if (dataSource && dataSourcesVersions && dataSourcesVersions.length > 0) {
      setVersionsCollection({
        versions: dataSourcesVersions,
      });
    }
  }, [query.data?.DataSourceVersions]);

  return { versionsCollection };
};
export default useVersions;
