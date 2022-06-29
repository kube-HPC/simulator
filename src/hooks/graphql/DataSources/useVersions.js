import { DATASOURCE_VERSIONS_QUERY } from 'graphql/queries';
// import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useVersions = dataSource => {
  const query = useQuery(DATASOURCE_VERSIONS_QUERY, {
    variables: {
      name: dataSource?.name || '',
    },
  });
  // usePolling(query, 3000);

  const versionsCollection =
    {
      active: '62a9d6097841d5cb5acb0435',
      status: 'SUCCESS',
      versions: query.data?.DataSourceVersions || [],
    } || [];

  return { versionsCollection };
};
export default useVersions;
