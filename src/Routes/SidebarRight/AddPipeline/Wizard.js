import React, { memo, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Steps } from 'antd';
import {
  BottomContent,
  Card,
  Form,
  JsonView,
  FlexBox,
} from 'components/common';
import { DRAWER_SIZE } from 'const';
import schema from 'config/schema/addPipeline.schema';
import styled from 'styled-components';
import { mapObjValues, stringify, notification } from 'utils';
import { mergeWith } from 'lodash';
import { BottomPosition } from 'styles';
import addPipelineTemplate from 'config/template/addPipeline.template';
import AddPipelineForm from './Form/AddPipelineForm.react';

// #region  Helpers
const steps = ['Initial', 'Nodes', 'Options'].map(label => (
  <Steps.Step key={label} title={label} />
));

// #region  Styling
const StepsBottom = styled.div`
  bottom: ${BottomContent.DefaultHeight};
`;

const FlexItemStart = styled(FlexBox.Item)`
  align-self: flex-start;
  width: 40%;
  height: 80vh;
`;

const FlexItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
  width: min-content;
`;

const Container = styled(FlexBox)`
  max-height: 100%;
`;
// #endregion

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
  // #region Bottom Buttons
  const onNextClick = useCallback(() => {
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
  }, [addPipeline, pipeline, step, setStep]);

  // #region Form Control
  const onValuesChange = useCallback(
    (_, changedValues) => {
      setPipeline(prevObj => ({
        ...mergeWith(prevObj, changedValues, mergeMapper),
      }));
    },
    [setPipeline]
  );
  // 1. Inject antd `form` object and callbacks.
  // 2. Memoize the returned component from Form.create
  //    against unnecessary re-renders due to callbacks.
  // 3. Memoize the whole value to not lose component's state on re-render.
  const FormInjected = useMemo(
    () =>
      memo(Form.create({ mapPropsToFields, onValuesChange })(AddPipelineForm)),
    [onValuesChange]
  );

  return (
    <>
      <Container gutter={15}>
        <FlexItemStart>
          <Card>
            <JsonView jsonObject={pipeline} collapsed={undefined} />
          </Card>
        </FlexItemStart>
        <FlexItemGrow as={FlexItemStart}>
          <FormInjected step={step} />
        </FlexItemGrow>
      </Container>

      <BottomContent.Divider />
      <StepsBottom as={BottomPosition}>
        <Steps type="navigation" size="small" current={step} onChange={setStep}>
          {steps}
        </Steps>
      </StepsBottom>

      <BottomContent.Divider />
      <BottomContent
        width={DRAWER_SIZE.ADD_PIPELINE}
        extra={[
          <Button key="Editor" onClick={toggle}>
            Editor View
          </Button>,
        ]}>
        <Button disabled={!step} onClick={onPrevClick}>
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
      </BottomContent>
    </>
  );
};

Wizard.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Wizard;
