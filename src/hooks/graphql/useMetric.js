import { useMemo } from 'react';
/* eslint-disable import/no-cycle */
import { useStats } from 'hooks/graphql';

const useMetric = metric => {
  const { statistics } = useStats();

  const statisticsForMetric = useMemo(
    () =>
      statistics && statistics.find(statistic => statistic.metric === metric),
    [statistics, metric]
  );

  const data = useMemo(
    () =>
      statisticsForMetric &&
      statisticsForMetric.results.map(res => {
        const algorithms =
          res && res.algorithmsData
            ? res.algorithmsData.reduce(
                (acc, algorithm) => ({
                  ...acc,
                  [algorithm.name]: algorithm.size,
                }),
                {}
              )
            : {};

        return {
          nodes: res?.name,
          ...algorithms,
        };
      }),
    [statisticsForMetric]
  );

  return {
    data: data || [],
    legend: statisticsForMetric && statisticsForMetric.legend,
  };
};
export default useMetric;
