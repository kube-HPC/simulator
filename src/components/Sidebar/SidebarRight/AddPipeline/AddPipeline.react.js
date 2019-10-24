import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addPipeline } from 'actions/pipeline.action';
import AddPipelineWizard from './AddPipelineWizard.react';

const AddPipeline = () => {
  const dispatch = useDispatch();
  const onSubmit = useCallback(pipeline => dispatch(addPipeline(pipeline)), [dispatch]);

  return <AddPipelineWizard onSubmit={onSubmit} />;
};

export default memo(AddPipeline);
