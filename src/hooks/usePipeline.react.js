import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateStoredPipeline,
  execStoredPipeline,
  deleteStoredPipeline,
  cronStop,
  cronStart
} from 'actions/pipeline.action';
import { getPipelineReadme, postPipelineReadme } from 'actions/readme.action';
import { tableDataSelector } from 'utils/hooks';
import { STATE_SOURCES } from 'reducers/root.reducer';

const dataSelector = tableDataSelector(
  STATE_SOURCES.PIPELINE_TABLE,
  filter => record => record.name.includes(filter)
);

export default function usePipeline() {
  const storedPipelines = useSelector(dataSelector);
  const dataStats = useSelector(state => state.pipelineTable.dataStats);
  const pipelineReadme = useSelector(state => state.pipelineReadme);

  const dispatch = useDispatch();

  const _cronStart = useCallback((e, p) => dispatch(cronStart(e, p)), [
    dispatch
  ]);
  const _cronStop = useCallback((e, p) => dispatch(cronStop(e, p)), [dispatch]);

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
    storedPipelines,
    dataStats,
    getPipelineReadme: record =>
      pipelineReadme &&
      pipelineReadme[record.name] &&
      pipelineReadme[record.name].readme &&
      pipelineReadme[record.name].readme.readme,
    cronStart: _cronStart,
    cronStop: _cronStop,
    deleteStoredPipeline: _deleteStoredPipeline,
    execStoredPipeline: _execStoredPipeline,
    updatePipelineReadme: _getPipelineReadme,
    onSubmit: _onSubmit,
    updateStoredPipeline: _updateStoredPipeline
  };
}
