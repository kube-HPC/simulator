import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

export default metric => {
  const statistics = useSelector(selectors.nodeStatistics);

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
