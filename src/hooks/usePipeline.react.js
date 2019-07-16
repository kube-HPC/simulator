import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  updateStoredPipeline,
  execStoredPipeline,
  deleteStoredPipeline,
  cronStop,
  cronStart
} from 'actions/pipeline.action';
import { getPipelineReadme, postPipelineReadme } from 'actions/readme.action';

export default function usePipeline() {
  const dispatch = useDispatch();

  const _cronStart = useCallback(e => dispatch(cronStart(e)), [dispatch]);
  const _cronStop = useCallback(e => dispatch(cronStop(e)), [dispatch]);

  const _updateStoredPipeline = useCallback(
    e => dispatch(updateStoredPipeline(e)),
    [dispatch]
  );
  const _execStoredPipeline = useCallback(
    e => dispatch(execStoredPipeline(e)),
    [dispatch]
  );
  const _getPipelineReadme = useCallback(
    record => dispatch(getPipelineReadme(record.name)),
    [dispatch]
  );

  const _deleteStoredPipeline = useCallback(
    e => dispatch(deleteStoredPipeline(e)),
    [dispatch]
  );

  const _onSubmit = useCallback(
    ({ value, readme }) => {
      dispatch(updateStoredPipeline(value));
      dispatch(postPipelineReadme(value.name, readme));
    },
    [dispatch]
  );

  return {
    cronStart: _cronStart,
    cronStop: _cronStop,
    deleteStoredPipeline: _deleteStoredPipeline,
    execStoredPipeline: _execStoredPipeline,
    getPipelineReadme: _getPipelineReadme,
    onSubmit: _onSubmit,
    updateStoredPipeline: _updateStoredPipeline
  };
}
