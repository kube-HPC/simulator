import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Card, Button } from 'antd';
import styled from 'styled-components';

import AddPipelineSteps from 'components/dumb/AddPipeline/AddPipelineSteps.react';
import JsonEditor from 'components/dumb/JsonEditor.react';
import template from 'config/template/addPipeline.template';
import { stringify } from 'utils/string';
import { addPipeline } from 'actions/addPipeline.action';

const CardCenter = styled(Card)`
  width: 100%;
  margin: 0 auto;
`;

function AddPipeline({ onSubmit, addPipeline }) {
  const [json, setJson] = useState(stringify(template));

  return <AddPipelineSteps onSubmit={onSubmit} />;
}

AddPipeline.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  () => {},
  { addPipeline }
)(AddPipeline);
