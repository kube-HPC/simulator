import { JOB_GRID_VIEW_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
// import sum from 'hash-sum';

const useJobsGrid = () => {
  const query = useQuery(JOB_GRID_VIEW_QUERY);

  usePolling(query, 3000);

  const collection =
    (query.data?.jobsAggregated && query.data?.jobsAggregated.jobs) || [];
  //  const stats = query.data?.discovery.taskExecutor[0].actual;
  //  const nextSum = sum({ collection, stats });
  // if (state.sum === nextSum) return state;

  /* const nextCollection = collection.reduce(
    (acc, item) => ({
      ...acc,
      [item.algorithmName]: (acc[item.algorithmName] || []).concat(item),
    }),
    {}
  ); */

  return {
    collection,
    //  stats,
    //   sum: nextSum,
    //   ids: Object.keys(nextCollection),
  };
};
export default useJobsGrid;
