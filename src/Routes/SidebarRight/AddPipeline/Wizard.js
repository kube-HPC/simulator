import React, { useCallback, useMemo, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Steps } from 'antd';
import { Card, JsonView, Form } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import styled from 'styled-components';
import { mapObjValues, stringify, notification } from 'utils';
import { mergeWith } from 'lodash';
import { COLOR_LAYOUT } from 'styles';
import addPipelineTemplate from 'config/template/addPipeline.template';
import AddPipelineForm from './AddPipelineForm';
import { BottomPanel } from './styles';

const steps = ['Initial', 'Nodes', 'Options'].map(label => (
  <Steps.Step key={label} title={label} />
));

const FormContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding-bottom: 2em;
`;

export const Body = styled.div`
  display: flex;
  flex-grow: 1;
  height: 0;
`;

const JsonViewWrapper = styled(Card)`
  flex: 1;
  transition: none;
  margin-right: 2ch;
  border-bottom: none;
`;

const innerClasses = ['flowInput'];

const mapper = ({ key, value }) =>
  Form.createFormField({
    value: innerClasses.includes(key) ? stringify(value) : value,
  });
const mapPredicate = ({ key }) => innerClasses.includes(key);

const mapPropsToFields = () =>
  mapObjValues({ obj: addPipelineTemplate, mapper, mapPredicate });

// Customizer for lodash merge.
// TODO: fix inconsistent return
// eslint-disable-next-line
const mergeMapper = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
};

const Wizard = ({ toggle, addPipeline }) => {
  const [pipeline, setPipeline] = useState(addPipelineTemplate);
  const [step, setStep] = useState(0);
  const onPrevClick = () => setStep(s => s - 1);
  const isLastStep = step === steps.length - 1;

  const onNextClick = () => {
    const isValidPipeline =
      !pipeline.name ||
      !pipeline.nodes.every(
        ({ nodeName, algorithmName }) => nodeName && algorithmName
      );

    const isSubmit = step === steps.length - 1;

    const { webhooks, ...restPipeline } = pipeline;
    const { progress, result } = webhooks;
    const areValidWebhooks = progress && result;

    const pipelineToAdd = areValidWebhooks
      ? pipeline
      : progress
      ? { webhooks: { progress }, ...restPipeline }
      : result
      ? { webhooks: { result }, ...restPipeline }
      : restPipeline;

    isSubmit
      ? isValidPipeline
        ? notification({ message: 'Empty Required Field!' })
        : addPipeline(pipelineToAdd)
      : setStep(s => s + 1);
  };

  const onValuesChange = useCallback(
    (_, changedValues) =>
      setPipeline(prevObj => ({
        ...mergeWith(prevObj, changedValues, mergeMapper),
      })),
    [setPipeline]
  );
  // 1. Inject antd `form` object and callbacks.
  // 2. Memoize the returned component from Form.create
  //    against unnecessary re-renders due to callbacks.
  // 3. Memoize the whole value to not lose component's state on re-render.
  const FormInjected = useMemo(
    () =>
      // do not drop this memo it will break the form's behavior!
      memo(Form.create({ mapPropsToFields, onValuesChange })(AddPipelineForm)),
    [onValuesChange]
  );

  return (
    <>
      <Body>
        <JsonViewWrapper>
          <JsonView jsonObject={pipeline} collapsed={undefined} />
        </JsonViewWrapper>
        <FormContainer>
          <FormInjected step={step} />
        </FormContainer>
      </Body>
      <Steps
        type="navigation"
        size="small"
        current={step}
        onChange={setStep}
        style={{ borderTop: `1px solid ${COLOR_LAYOUT.border}` }}>
        {steps}
      </Steps>
      <BottomPanel>
        <Button onClick={toggle}>Editor View</Button>
        <Button
          disabled={!step}
          onClick={onPrevClick}
          style={{ marginLeft: 'auto', marginRight: '1ch' }}>
          <Icon type="left" />
          Back
        </Button>
        <Button
          type={isLastStep ? 'primary' : 'default'}
          onClick={onNextClick}
          form={schema.ID}
          htmlType="submit">
          {isLastStep ? 'Submit' : 'Next'}
          <Icon type={isLastStep ? 'check' : 'right'} />
        </Button>
      </BottomPanel>
    </>
  );
};

Wizard.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Wizard;
