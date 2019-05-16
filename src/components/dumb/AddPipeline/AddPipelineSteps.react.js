import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddPipelineForm from 'components/dumb/AddPipeline/AddPipelineForm.react';
import { Row, Col, Steps, Card, Divider } from 'antd';

import JsonView from 'components/dumb/JsonView.react';
import template from 'config/template/addPipeline.template';
import { addPipeline } from 'actions/addPipeline.action';

function AddPipelineSteps(props) {
  const [formData, setFormData] = useState(template);

  return (
    <AddPipelineForm
      formData={formData}
      algorithms={props.algorithms}
      pipelines={props.storedPipelines.map(pipeline => pipeline.name)}
      onSubmit={pipeline => {
        props.addPipeline(pipeline);
        props.onSubmit();
      }}
      onChange={setFormData}
    />
  );
}

AddPipelineSteps.propTypes = {
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
)(AddPipelineSteps);
