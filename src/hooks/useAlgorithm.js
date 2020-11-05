import { useMemo } from 'react';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';
import { tableFilterSelector } from 'utils';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state =>
  state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = name => {
  const algorithmSource = useSelector(dataSelector);
  const buildsSource = useSelector(buildsSelector);

  // Merged Source with builds
  const dataSource = useMemo(
    () =>
      algorithmSource.map(source => ({
        ...source,
        builds: buildsSource.filter(
          ({ algorithmName }) => algorithmName === source.name
        ),
      })),
    [algorithmSource, buildsSource]
  );

  const algorithm = useMemo(
    () =>
      name ? dataSource.find(({ name: source }) => source === name) : null,
    [name, dataSource]
  );

  return {
    algorithm,
    dataSource,
  };
};

export default useAlgorithm;
