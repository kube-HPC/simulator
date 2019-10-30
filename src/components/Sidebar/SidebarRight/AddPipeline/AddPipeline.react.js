// #region  Imports
import React, { memo, useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addPipeline } from 'actions/pipeline.action';

import { FlexBox, JsonView, BottomContent, JsonEditor, Card, Form } from 'components/common';
import { Steps, Button, Icon } from 'antd';
import { DRAWER_SIZE } from 'const';
import schema from 'config/schema/addPipeline.schema';
import AddPipelineForm from './AddPipelineForm.react';
import { Display } from 'styles';
import { addPipelineTemplate } from 'config';
import { stringify, mapObjValues, tryParse, notification } from 'utils';
import { mergeWith } from 'lodash';
// #endregion

// #region  Styling
const StepsBottom = styled(Steps)`
  position: absolute;
  bottom: ${BottomContent.DefaultHeight};
  left: 0;
  background-color: white;
`;

const FlexItemStart = styled(FlexBox.Item)`
  align-self: flex-start;
`;

const FlexItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
  width: min-content;
`;
// #endregion

// #region  Helpers
const steps = ['Initial', 'Nodes', 'Options'].map(label => (
  <Steps.Step key={label} title={label} />
));

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);
const SPACE_BETWEEN = 20;

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
  const [jsonViewObj, setJsonViewObj] = useState(addPipelineTemplate);

  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();
  const isLastStep = isEditorVisible || step === steps.length - 1;

  const dispatchPipeline = useCallback(value => dispatch(addPipeline(value)), [dispatch]);

  useEffect(() => {
    setIsSubmit(step === steps.length - 1);
  }, [isEditorVisible, step]);

  const onNextClick = useCallback(() => {
    const isValidPipeline =
      !jsonViewObj.name ||
      !jsonViewObj.nodes.every(({ nodeName, algorithmName }) => nodeName && algorithmName);

    isSubmit
      ? isValidPipeline
        ? notification({ message: 'Empty Required Field!' })
        : dispatchPipeline(jsonViewObj)
      : setStep(prevStep => prevStep + 1);
  }, [dispatchPipeline, isSubmit, jsonViewObj]);

  const onEditorSubmit = () =>
    tryParse({ src: editorValue, onSuccess: ({ parsed }) => dispatchPipeline(parsed) });

  const onPrevClick = () => setStep(prevStep => prevStep - 1);
  const onDefault = () => setEditorValue(INITIAL_EDITOR_VALUE);
  const onClear = () => setEditorValue('');

  const onValuesChange = useCallback(
    (_, changedValues) =>
      setJsonViewObj(prevObj => ({ ...mergeWith(prevObj, changedValues, mergeMapper) })),
    []
  );

  // 1. Inject antd `form` object and callbacks.
  // 2. Memoize the returned component from Form.create
  //    against unnecessary re-renders due to callbacks.
  // 3. Memoize the whole value to not lose component's state on re-render.
  const FormInjected = useMemo(
    () => memo(Form.create({ mapPropsToFields, onValuesChange })(AddPipelineForm)),
    [onValuesChange]
  );

  return (
    <>
      <Display isVisible={isEditorVisible}>
        <Card>
          <JsonEditor value={editorValue} onChange={setEditorValue} />
        </Card>
      </Display>
      <Display isVisible={!isEditorVisible}>
        <FlexBox gutter={SPACE_BETWEEN}>
          <FlexItemStart>
            <Card>
              <JsonView jsonObject={jsonViewObj} collapsed={undefined} />
            </Card>
          </FlexItemStart>
          <FlexItemGrow as={FlexItemStart}>
            <FormInjected isSubmit={isSubmit} step={step} />
          </FlexItemGrow>
        </FlexBox>

        <BottomContent.Divider />
        <StepsBottom type="navigation" size="small" current={step} onChange={setStep}>
          {steps}
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
          </Display>
        ]}
      >
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
          htmlType="submit"
        >
          {isLastStep ? 'Submit' : 'Next'}
          <Icon type={isLastStep ? 'check' : 'right'} />
        </Button>
      </BottomContent>
    </>
  );
};

export default memo(AddPipeline);
