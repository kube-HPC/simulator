import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddPipelineForm from 'components/dumb/AddPipeline/AddPipelineForm.react';
import { Row, Col, Steps, Card } from 'antd';

import JsonView from 'components/dumb/JsonView.react';
import template from 'config/template/addPipeline.template';
import { addPipeline } from 'actions/addPipeline.action';

function AddPipelineSteps(props) {
  const [formData, setFormData] = useState(template);
  const [step, setStep] = useState(0);
  const steps = ['Initial', 'Nodes', 'Side Effects', 'Triggers', 'Options'];
  const span = 15;

  return (
    <Card
      title={
        <Steps progressDot current={step}>
          {steps.map(title => (
            <Steps.Step key={title} title={title} />
          ))}
        </Steps>
      }
    >
      <Row gutter={15} type="flex" justify="space-between">
        <Col span={24 - span}>
          <Card>
            <JsonView jsonObject={formData} />
          </Card>
        </Col>
        <Col span={span}>
          <Card>
            <AddPipelineForm
              formData={formData}
              algorithms={props.algorithms}
              pipelines={props.storedPipelines.map(pipeline => pipeline.name)}
              onSubmit={pipeline => {
                props.addPipeline(pipeline);
                props.onSubmit();
              }}
              onChange={setFormData}
              onStep={setStep}
              step={step}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

AddPipelineSteps.propTypes = {
  storedPipelines: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
  addPipeline: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  algorithms: state.algorithmTable.dataSource.map(tableRow => tableRow.key),
  storedPipelines: state.storedPipeline.dataSource
});

export default connect(
  mapStateToProps,
  { addPipeline }
)(AddPipelineSteps);
