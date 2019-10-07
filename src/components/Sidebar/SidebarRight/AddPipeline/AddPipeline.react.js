import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addPipeline } from 'actions/pipeline.action';
import { STATE_SOURCES } from 'const';
import AddPipelineWizard from './AddPipelineWizard.react';

const algorithmNamesSelector = state =>
  state[STATE_SOURCES.ALGORITHM_TABLE].dataSource.map(({ name }) => name);

const pipelineNamesSelector = state =>
  state[STATE_SOURCES.PIPELINE_TABLE].dataSource.map(({ name }) => name);

const AddPipeline = () => {
  const dispatch = useDispatch();

  const algorithms = useSelector(algorithmNamesSelector);
  const pipelines = useSelector(pipelineNamesSelector);
  const onSubmit = useCallback(pipeline => dispatch(addPipeline(pipeline)), [dispatch]);

  return <AddPipelineWizard algorithms={algorithms} pipelines={pipelines} onSubmit={onSubmit} />;
};

export default memo(AddPipeline);
