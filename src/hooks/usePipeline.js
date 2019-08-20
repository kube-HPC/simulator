import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import {
  updateStoredPipeline,
  execStoredPipeline,
  deleteStoredPipeline,
  cronStop,
  cronStart
} from 'actions/pipeline.action';

import { getPipelineReadme, postPipelineReadme } from 'actions/readme.action';
import { STATE_SOURCES } from 'const';
import { tableDataSelector } from 'utils/hooks';

const dataSelector = tableDataSelector(STATE_SOURCES.PIPELINE_TABLE, filter => record =>
  record.name.includes(filter)
);

export default function usePipeline() {
  const dataSource = useSelector(dataSelector, isEqual);
  const dataStats = useSelector(state => state.pipelineTable.dataStats, isEqual);
  const pipelineReadme = useSelector(state => state.pipelineReadme, isEqual);

  const dispatch = useDispatch();

  const _onSubmit = useCallback(
    ({ value, readme }) => {
      dispatch(updateStoredPipeline(value));
      dispatch(postPipelineReadme(value.name, readme));
    },
    [dispatch]
  );

  return {
    dataSource,
    dataStats,
    getPipelineReadme: record =>
      pipelineReadme &&
      pipelineReadme[record.name] &&
      pipelineReadme[record.name].readme &&
      pipelineReadme[record.name].readme.readme,
    cronStart: useCallback((e, p) => dispatch(cronStart(e, p)), [dispatch]),
    cronStop: useCallback((e, p) => dispatch(cronStop(e, p)), [dispatch]),
    deleteStoredPipeline: useCallback(e => dispatch(deleteStoredPipeline(e)), [dispatch]),
    execStoredPipeline: useCallback(e => dispatch(execStoredPipeline(e)), [dispatch]),
    updatePipelineReadme: useCallback(record => dispatch(getPipelineReadme(record.name)), [
      dispatch
    ]),
    onSubmit: _onSubmit,
    updateStoredPipeline: useCallback(e => dispatch(updateStoredPipeline(e)), [dispatch])
  };
}
