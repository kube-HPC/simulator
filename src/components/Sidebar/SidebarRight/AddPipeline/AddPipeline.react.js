import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addPipeline } from 'actions/pipeline.action';
import AddPipelineForm from 'components/Sidebar/SidebarRight/AddPipeline/AddPipelineForm.react';

function AddPipeline() {
  const dispatch = useDispatch();
  const algorithms = useSelector(state => state.algorithmTable.dataSource.map(key => key.name));
  const storedPipelines = useSelector(state => state.pipelineTable.dataSource);

  return (
    <AddPipelineForm
      algorithms={algorithms}
      pipelines={storedPipelines.map(pipeline => pipeline.name)}
      onSubmit={pipeline => {
        dispatch(addPipeline(pipeline));
      }}
    />
  );
}

export default AddPipeline;
