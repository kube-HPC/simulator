import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import { useDrawerEditor } from 'hooks';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { stringify, tableFilterSelector } from 'utils';
import useActions from './useActions';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state => state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = () => {
  const { applyAlgorithm, deleteAlgorithm } = useActions();

  const onSubmit = useCallback(
    value => {
      const formData = new FormData();
      formData.append('payload', value);
      applyAlgorithm(formData);
    },
    [applyAlgorithm],
  );

  const { open } = useDrawerEditor({ onSubmit });

  const algorithmSource = useSelector(dataSelector);
  const buildsSource = useSelector(buildsSelector);

  // Merged Source with builds
  const dataSource = algorithmSource.map(source => ({
    ...source,
    builds: buildsSource.filter(({ algorithmName }) => algorithmName === source.name),
  }));

  return {
    dataSource,
    onDelete: deleteAlgorithm,
    open: value => open(stringify(value)),
  };
};

export default useAlgorithm;
