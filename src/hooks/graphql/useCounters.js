import { COUNTERS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useCounters = () => {
  const query = useQuery(COUNTERS_QUERY);

  usePolling(query, 3000);

  const counters = {
    jobs: query?.data?.jobsAggregated?.jobsCount || 0,
    pipelines: query?.data?.pipelines?.pipelinesCount || 0,
    algorithms: query?.data?.algorithms?.algorithmsCount || 0,
    queue:
      (query?.data?.queueCount?.managed || 0) +
      (query?.data?.queueCount?.preferred || 0),
    dataSources: query?.data?.dataSources?.dataSourcesCount,
  };

  return {
    counters,
  };
};
export default useCounters;
