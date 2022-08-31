import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';

const useGetLists = () => {
  const query = useQuery(ALGORITHM_AND_PIPELINE_NAMES);

  const algorithms = useMemo(
    () =>
      query?.data?.algorithms.list
        ?.map(algorithm => ({
          value: algorithm.name,
          label: algorithm.name,
        }))
        .sort((a, b) => (a.label > b.label ? 1 : -1)),
    [query?.data?.algorithms.list]
  );

  const pipelines = useMemo(
    () =>
      query?.data?.pipelines.list
        .map(pipeline => ({
          value: pipeline.name,
          label: pipeline.name,
        }))
        .sort((a, b) => (a.label > b.label ? 1 : -1)),
    [query?.data?.pipelines.list]
  );

  return {
    algorithms,
    pipelines,
  };
};
export default useGetLists;
