import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { addPipeline } from 'actions/pipeline.action';
import AddPipelineForm from 'components/Layout/SidebarRight/AddPipeline/AddPipelineForm.react';

function AddPipeline({ onSubmit }) {
  const dispatch = useDispatch();

  const algorithms = useSelector(state =>
    state.algorithmTable.dataSource.map(key => key.name)
  );

  const storedPipelines = useSelector(state => state.pipelineTable.dataSource);

  return (
    <AddPipelineForm
      algorithms={algorithms}
      pipelines={storedPipelines.map(pipeline => pipeline.name)}
      onSubmit={pipeline => {
        dispatch(addPipeline(pipeline));
        onSubmit();
      }}
    />
  );
}

AddPipeline.propTypes = {
  onSubmit: PropTypes.func
};

export default AddPipeline;
