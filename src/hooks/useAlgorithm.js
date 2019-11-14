import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAlgorithmReadme, postAlgorithmReadme } from 'actions/readme.action';
import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { stringify } from 'utils/string';
import { tableFilterSelector } from 'utils';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state => state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = () => {
  const dispatch = useDispatch();

  // #region  Readme Actions
  const onSubmit = useCallback(
    ({ value, readme }) => {
      const formData = new FormData();
      formData.append('payload', stringify(value));
      dispatch(applyAlgorithm(formData));
      dispatch(postAlgorithmReadme(value.name, readme));
    },
    [dispatch],
  );

  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [dispatch]);
  const fetchReadme = useCallback(name => dispatch(getAlgorithmReadme(name)), [dispatch]);
  const readmeDict = useSelector(state => state.algorithmReadme);
  const getReadme = name => readmeDict && readmeDict[name] && readmeDict[name].readme;
  // #endregion

  // #region  Data Source
  const algorithmSource = useSelector(dataSelector);
  const buildsSource = useSelector(buildsSelector);

  // Merged Source with builds
  const dataSource = algorithmSource.map(source => ({
    ...source,
    builds: buildsSource.filter(({ algorithmName }) => algorithmName === source.name),
  }));
  // #endregion

  return {
    dataSource,
    fetchReadme,
    getReadme,
    onDelete,
    onSubmit,
  };
};

export default useAlgorithm;
