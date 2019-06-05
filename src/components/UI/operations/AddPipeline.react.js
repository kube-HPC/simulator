import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddPipelineForm from 'components/dumb/AddPipeline/AddPipelineForm.react';

import { addPipeline } from 'actions/addPipeline.action';

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
  storedPipelines: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
  addPipeline: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  algorithms: state.algorithmTable.dataSource.map(tableRow => tableRow.name),
  storedPipelines: state.storedPipeline.dataSource
});

export default connect(
  mapStateToProps,
  { addPipeline }
)(AddPipeline);
