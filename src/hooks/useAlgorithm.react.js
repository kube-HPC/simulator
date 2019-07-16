import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getAlgorithmReadme, postAlgorithmReadme } from 'actions/readme.action';
import { applyAlgorithm, deleteAlgorithm } from 'actions/algorithm.action';
import { stringify } from 'utils/string';

export default function useAlgorithm() {
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    ({ value, readme }) => {
      const formData = new FormData();
      formData.append('payload', stringify(value));
      dispatch(applyAlgorithm(formData));
      dispatch(postAlgorithmReadme(value.name, readme));
    },
    [dispatch]
  );

  const onDelete = useCallback(data => dispatch(deleteAlgorithm(data)), [
    dispatch
  ]);

  const fetchReadme = useCallback(
    record => dispatch(getAlgorithmReadme(record.name)),
    [dispatch]
  );

  return {
    onSubmit,
    onDelete,
    fetchReadme
  };
}
