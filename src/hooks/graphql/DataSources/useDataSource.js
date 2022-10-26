import { useEffect, useState } from 'react';
import { DATASOURCES_LIST_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useDataSource = () => {
  const [sortedDataSources, setSortedDataSources] = useState([]);
  const query = useQuery(DATASOURCES_LIST_QUERY);
  usePolling(query, 3000);

  useEffect(() => {
    const dataSources = query.data?.dataSources?.list || [];
    if (dataSources != null && dataSources.length > 0) {
      setSortedDataSources(
        dataSources.slice().sort((a, b) => (b.id > a.id ? 1 : -1))
      );
    }
  }, [query.data?.dataSources?.list]);

  return {
    sortedDataSources,
  };
};
export default useDataSource;
