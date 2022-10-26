import { DATASOURCE_BY_ID_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useActiveDataSource = (dataSourceName, dataSourceId) => {
  const query = useQuery(DATASOURCE_BY_ID_QUERY, {
    variables: {
      name: dataSourceName,
      dataSourceId,
    },
  });
  usePolling(query, 3000);

  const activeDataSource = query.data?.dataSource || [];

  return {
    activeDataSource,
  };
};
export default useActiveDataSource;
