import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { tableFilterSelector } from 'utils';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state => state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = () => {
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    value => {
      const formData = new FormData();
      formData.append('payload', value);
      dispatch(applyAlgorithm(formData));
    },
    [dispatch],
  );

  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [dispatch]);

  const algorithmSource = useSelector(dataSelector);
  const buildsSource = useSelector(buildsSelector);

  // Merged Source with builds
  const dataSource = algorithmSource.map(source => ({
    ...source,
    builds: buildsSource.filter(({ algorithmName }) => algorithmName === source.name),
  }));

  return {
    dataSource,
    onDelete,
    onSubmit,
  };
};

export default useAlgorithm;
