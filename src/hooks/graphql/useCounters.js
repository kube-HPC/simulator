import { COUNTERS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import { instanceFiltersVar, dateTimeDefaultVar } from 'cache';

const useCounters = () => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);

  const query = useQuery(COUNTERS_QUERY, {
    variables: {
      datesRange: {
        from: instanceFilters?.jobs?.datesRange?.from || dateTimeDefault,
        to: instanceFilters?.jobs?.datesRange?.to || null,
      },
    },
  });

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
