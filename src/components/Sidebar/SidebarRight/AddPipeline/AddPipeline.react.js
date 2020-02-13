import { Button, Icon, Steps } from 'antd';
import { BottomContent, Card, FlexBox, Form, JsonEditor, JsonView } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import addPipelineTemplate from 'config/template/addPipeline.template';
import { DRAWER_SIZE } from 'const';
import { useActions } from 'hooks';
import { mergeWith } from 'lodash';
import React, { memo, useCallback, useMemo, useReducer, useState } from 'react';
import styled from 'styled-components';
import { BottomPosition, Display } from 'styles';
import { mapObjValues, notification, stringify, tryParse } from 'utils';
import AddPipelineForm from './Form/AddPipelineForm.react';

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

// #region  Helpers
const steps = ['Initial', 'Nodes', 'Options'].map(label => (
  <Steps.Step key={label} title={label} />
));

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);

const innerClasses = ['flowInput'];

const mapper = ({ key, value }) =>
  Form.createFormField({ value: innerClasses.includes(key) ? stringify(value) : value });
const mapPredicate = ({ key }) => innerClasses.includes(key);
const mapPropsToFields = () => mapObjValues({ obj: addPipelineTemplate, mapper, mapPredicate });

// Customizer for lodash merge.
const mergeMapper = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
};
// #endregion

const AddPipeline = () => {
  const [step, setStep] = useState(0);
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorValue, setEditorValue] = useState(INITIAL_EDITOR_VALUE);
  const [pipeline, setPipeline] = useState(addPipelineTemplate);

  const { addPipeline } = useActions();

  // #region Bottom Buttons
  const onNextClick = useCallback(() => {
    const isValidPipeline =
      !pipeline.name ||
      !pipeline.nodes.every(({ nodeName, algorithmName }) => nodeName && algorithmName);

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
  }, [addPipeline, pipeline, step]);

  const onEditorSubmit = () =>
    tryParse({ src: editorValue, onSuccess: ({ parsed }) => addPipeline(parsed) });

  const onPrevClick = () => setStep(s => s - 1);
  const onDefault = () => setEditorValue(INITIAL_EDITOR_VALUE);
  const onClear = () => setEditorValue('');
  // #endregion

  // #region Form Control
  const onValuesChange = useCallback((_, changedValues) => {
    setPipeline(prevObj => ({ ...mergeWith(prevObj, changedValues, mergeMapper) }));
  }, []);

  // 1. Inject antd `form` object and callbacks.
  // 2. Memoize the returned component from Form.create
  //    against unnecessary re-renders due to callbacks.
  // 3. Memoize the whole value to not lose component's state on re-render.
  const FormInjected = useMemo(
    () => memo(Form.create({ mapPropsToFields, onValuesChange })(AddPipelineForm)),
    [onValuesChange],
  );

  const isLastStep = isEditorVisible || step === steps.length - 1;
  // #endregion

  return (
    <>
      <Display isVisible={isEditorVisible}>
        <Card>
          <JsonEditor value={editorValue} onChange={setEditorValue} />
        </Card>
      </Display>
      <Display isVisible={!isEditorVisible}>
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
      </Display>

      <BottomContent.Divider />
      <BottomContent
        width={DRAWER_SIZE.ADD_PIPELINE}
        extra={[
          <Button key="Editor" onClick={toggle}>
            {isEditorVisible ? 'Wizard' : 'Editor'} View
          </Button>,
          <Display key="Default" isVisible={isEditorVisible}>
            <Button type="dashed" onClick={onDefault}>
              Default
            </Button>
          </Display>,
          <Display key="Clear" isVisible={isEditorVisible}>
            <Button type="danger" onClick={onClear}>
              Clear
            </Button>
          </Display>,
        ]}>
        <Display isVisible={!isEditorVisible}>
          <Button disabled={!step} onClick={onPrevClick}>
            <Icon type="left" />
            Back
          </Button>
        </Display>
        <Button
          type={isLastStep ? 'primary' : 'default'}
          onClick={isEditorVisible ? onEditorSubmit : onNextClick}
          form={schema.ID}
          htmlType="submit">
          {isLastStep ? 'Submit' : 'Next'}
          <Icon type={isLastStep ? 'check' : 'right'} />
        </Button>
      </BottomContent>
    </>
  );
};

export default memo(AddPipeline);
