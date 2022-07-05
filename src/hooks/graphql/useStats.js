import { NODE_STATISTICS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

const useStats = () => {
  const query = useQuery(NODE_STATISTICS_QUERY);

  usePolling(query, 12000);
  const statistics = query?.data?.nodeStatistics || [];
  const [cpu, memory, gpu] = statistics;

  return { statistics, cpu, memory, gpu };
};
export default useStats;
