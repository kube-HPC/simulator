import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { postAlgorithmReadme } from 'actions/readme.action';
import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { stringify } from 'utils/string';
import { tableFilterSelector } from 'utils';
import { LEFT_SIDEBAR_NAMES, STATE_SOURCES } from 'const';
import useAlgorithmReadme from './useAlgorithmReadme';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.ALGORITHMS);
const buildsSelector = state => state[STATE_SOURCES.ALGORITHM_BUILDS_TABLE].dataSource;

const useAlgorithm = () => {
  const { fetch } = useAlgorithmReadme();

  const dispatch = useDispatch();

  // #region  Readme Actions
  const onSubmit = useCallback(
    ({ value, readme }) => {
      const formData = new FormData();
      formData.append('payload', stringify(value));
      dispatch(applyAlgorithm(formData));

      // const readmeFormData = new FormData();
      // formData.append('README.md', new File([new Blob([readme])], 'README.md'));
      // post({ name: value.name, formData: readmeFormData });
      dispatch(postAlgorithmReadme(value.name, readme));
    },
    [dispatch],
  );

  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [dispatch]);
  // const readmeDict = useSelector(state => state.algorithmReadme);
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
    fetchReadme: fetch,
    onDelete,
    onSubmit,
  };
};

export default useAlgorithm;
