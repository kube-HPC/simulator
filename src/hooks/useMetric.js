import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';

export default metric => {
  const { dataSource: statistics } = useSelector(state => state[STATE_SOURCES.NODE_STATISTICS]);

  const statisticsForMetric = useMemo(
    () => statistics && statistics.find(statistic => statistic.metric === metric),
    [statistics, metric],
  );

  const data = useMemo(
    () =>
      statisticsForMetric &&
      statisticsForMetric.results.map(res => {
        const algorithms = {};
        res &&
          res.algorithmsData &&
          res.algorithmsData.forEach(algorithm => (algorithms[algorithm.name] = algorithm.size));
        return {
          nodes: res.name,
          ...algorithms,
        };
      }),
    [statisticsForMetric],
  );

  return {
    data: data || [],
    legend: statisticsForMetric && statisticsForMetric.legend,
  };
};
