import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddPipelineForm from 'components/UI/Layout/SidebarOperations/AddPipeliene/AddPipelineForm.react';

import { addPipeline } from 'actions/pipeline.action';

function AddPipeline(props) {
  return (
    <AddPipelineForm
      algorithms={props.algorithms}
      pipelines={props.storedPipelines.map(pipeline => pipeline.name)}
      onSubmit={pipeline => {
        props.addPipeline(pipeline);
        props.onSubmit();
      }}
    />
  );
}

AddPipeline.propTypes = {
  storedPipelines: PropTypes.array,
  algorithms: PropTypes.array,
  addPipeline: PropTypes.func,
  onSubmit: PropTypes.func
};

const mapStateToProps = state => ({
  algorithms: state.algorithmTable.dataSource.map(tableRow => tableRow.name),
  storedPipelines: state.storedPipeline.dataSource
});

export default connect(
  mapStateToProps,
  { addPipeline }
)(AddPipeline);
