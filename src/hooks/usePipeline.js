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
import { LEFT_SIDEBAR_NAMES } from 'const';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

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
      pipelineReadme && pipelineReadme[record.name] && pipelineReadme[record.name].readme,
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
