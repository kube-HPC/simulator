import { useEffect, useState } from 'react';
import { DATASOURCE_PREVIEW_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const usePreviewQuery = (dataSourcePreviewQueryId, previewQuery) => {
  const [dataPreviewQuery, setDataPreviewQuery] = useState([]);
  const query = useQuery(DATASOURCE_PREVIEW_QUERY, {
    variables: {
      dataSourcePreviewQueryId,
      query: previewQuery?.query || '',
    },
  });
  usePolling(query, 3000);

  useEffect(() => {
    const dataSourcePreviewQuery = query?.data?.DataSourcePreviewQuery || [];
    if (dataSourcePreviewQuery.length > 0) {
      setDataPreviewQuery(dataSourcePreviewQuery);
    }
  }, [query?.data?.DataSourcePreviewQuery]);

  return {
    dataPreviewQuery,
  };
};
export default usePreviewQuery;
