import React from 'react';
import PropTypes from 'prop-types';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import NodeForm from './NodeForm.react';

const { NODES } = addPipelineSchema;

const Nodes = ({ getFieldDecorator }) => {
  return <>{getFieldDecorator(NODES.field)(<NodeForm />)}</>;
};

Nodes.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Nodes;
