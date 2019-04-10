import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AddPipelineForm from 'components/dumb/AddPipelineForm.react';
import { Row, Col, Steps, Card } from 'antd';

import JsonView from 'components/dumb/JsonView.react';

export default function AddPipelineSteps(props) {
  const [step, setStep] = useState(0);
  const steps = ['Initial', 'Nodes', 'Side Effects', 'Triggers', 'Options'];
  const span = 15;

  return (
    <Card
      style={props.style}
      title={
        <Steps progressDot current={step}>
          {steps.map(title => (
            <Steps.Step key={title} title={title} />
          ))}
        </Steps>
      }
    >
      <Row gutter={15} type="flex" justify="space-between">
        <Col span={span}>
          <AddPipelineForm
            formData={props.formData}
            algorithms={props.algorithms}
            pipelines={props.pipelines}
            onSubmit={props.onSubmit}
            onChange={props.onChange}
            onStep={setStep}
            step={step}
          />
        </Col>
        <Col span={24 - span}>
          <JsonView jsonObject={props.formData} />
        </Col>
      </Row>
    </Card>
  );
}

AddPipelineSteps.propTypes = {
  formData: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
  pipelines: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};
