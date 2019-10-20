import React, { memo, useState, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FlexBox, JsonView, BottomContent, JsonEditor, Card, Form } from 'components/common';
import { Steps, Button, Icon } from 'antd';
import { DRAWER_SIZE } from 'const';
import schema from 'config/schema/addPipeline.schema';
import AddPipelineForm from './AddPipelineForm.react';
import { Display } from 'styles';
import { addPipelineTemplate } from 'config';
import { stringify, mapObjValues } from 'utils';
import formTemplate from 'config/template/addPipelineForm.template';

const steps = Object.values(schema).map(({ label }) => <Steps.Step key={label} title={label} />);

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);
const SPACE_BETWEEN = 30;

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
`;

const mapper = ({ key, value }) =>
  Form.createFormField({ value: key === 'flowInput' ? stringify(value) : value });
const mapPredicate = ({ key }) => key === 'flowInput';
const mapPropsToFields = () => mapObjValues({ obj: formTemplate, mapper, mapPredicate });

const AddPipelineWizard = ({ algorithms, pipelines, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorValue, setEditorValue] = useState(INITIAL_EDITOR_VALUE);
  const [jsonViewObj, setJsonViewObj] = useState(formTemplate);

  const isLastStep = isEditorVisible || step === steps.length - 1;

  // TODO: send to reducer
  const onNextClick = () => setStep(prevStep => prevStep + 1);
  const onPrevClick = () => setStep(prevStep => prevStep - 1);
  const onDefault = () => setEditorValue(INITIAL_EDITOR_VALUE);
  const onClear = () => setEditorValue('');

  const onValuesChange = useCallback((_, changedValues) => {
    console.log(changedValues);
    setJsonViewObj(prevObj => ({ ...prevObj, ...changedValues }));
  }, []);

  // 1. Inject antd `form` object and callbacks.
  // 2. Memoize the returned component from Form.create
  //    against unnecessary re-renders due to callbacks.
  // 3. Memoize the whole value to not lose component's state on re-render.
  const AddPipelineInjected = useMemo(
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
              <JsonView jsonObject={jsonViewObj} />
            </Card>
          </FlexItemStart>
          <FlexItemGrow as={FlexItemStart}>
            <AddPipelineInjected onSubmit={onSubmit} isLastStep={isLastStep} step={step} />
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
        <Button type={isLastStep ? 'primary' : 'default'} onClick={onNextClick}>
          {isLastStep ? 'Submit' : 'Next'}
          <Icon type={isLastStep ? 'check' : 'right'} />
        </Button>
      </BottomContent>
    </>
  );
};

AddPipelineWizard.propTypes = {
  algorithms: PropTypes.array.isRequired,
  pipelines: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default memo(AddPipelineWizard);
