import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';
import { tableFilterSelector } from 'utils';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state => state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = name => {
  const algorithmSource = useSelector(dataSelector);
  const buildsSource = useSelector(buildsSelector);

  // Merged Source with builds
  const dataSource = algorithmSource.map(source => ({
    ...source,
    builds: buildsSource.filter(({ algorithmName }) => algorithmName === source.name),
  }));

  return {
    algorithm: name ? dataSource.find(({ name: source }) => source === name) : null,
    dataSource,
  };
};

export default useAlgorithm;
