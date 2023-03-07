import { COUNTERS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  instanceFiltersVar,
  instanceCounterVar,
  dateTimeDefaultVar,
} from 'cache';

const useCounters = () => {
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);
  let counters = null;

  const query = useQuery(COUNTERS_QUERY, {
    variables: {
      datesRange: {
        from: instanceFilters?.jobs?.datesRange?.from || dateTimeDefault.time,
        to: instanceFilters?.jobs?.datesRange?.to || null,
      },
    },
    onCompleted: data => {
      counters = {
        jobs: data?.jobsAggregated?.jobsCount || 0,
        pipelines: data?.pipelines?.pipelinesCount || 0,
        algorithms: data?.algorithms?.algorithmsCount || 0,
        queue:
          (data?.queueCount?.managed || 0) + (data?.queueCount?.preferred || 0),
        dataSources: data?.dataSources?.dataSourcesCount,
        drivers: data.discovery.pipelineDriver.length,
        workers: data.discovery.worker.length,
      };

      instanceCounterVar({
        ...instanceCounterVar(),
        ...counters,
      });
    },
  });

  usePolling(query, 3000);
};
export default useCounters;
