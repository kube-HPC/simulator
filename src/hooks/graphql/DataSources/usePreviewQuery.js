import { DATASOURCE_PREVIEW_QUERY } from 'graphql/queries';
// import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const usePreviewQuery = (dataSourcePreviewQueryId, previewQuery) => {
  const query = useQuery(DATASOURCE_PREVIEW_QUERY, {
    variables: {
      dataSourcePreviewQueryId,
      query: previewQuery?.query || '',
    },
  });
  // usePolling(query, 3000);

  const dataPreviewQuery = query?.data?.DataSourcePreviewQuery;

  return {
    dataPreviewQuery,
  };
};
export default usePreviewQuery;
