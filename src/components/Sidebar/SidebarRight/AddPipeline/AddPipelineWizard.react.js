import React, { memo, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FlexBox, JsonView, BottomContent, JsonEditor, Card } from 'components/common';
import { Steps, Button, Icon } from 'antd';
import { DRAWER_SIZE } from 'const';
import schema from 'config/schema/addPipeline.schema';
import AddPipelineForm from './AddPipelineForm.react';
import { Display } from 'styles';
import { addPipelineTemplate } from 'config';
import { stringify } from 'utils';

const steps = Object.values(schema).map(({ label }) => <Steps.Step key={label} title={label} />);

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);
const EMPTY_EXTRA = [];
const SPACE_BETWEEN = 30;

const StepsBottom = styled(Steps)`
  position: absolute;
  bottom: ${BottomContent.DefaultHeight};
  left: 0;
`;

const FlexItemStart = styled(FlexBox.Item)`
  align-self: flex-start;
`;

const FlexItemGrow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const AddPipelineWizard = ({ algorithms, pipelines, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorValue, setEditorValue] = useState(INITIAL_EDITOR_VALUE);

  const isLastStep = isEditorVisible || step === steps.length - 1;

  const onNextClick = () => setStep(prevStep => prevStep + 1);
  const onPrevClick = () => setStep(prevStep => prevStep - 1);

  const onDefault = () => setEditorValue(INITIAL_EDITOR_VALUE);
  const onClear = () => setEditorValue('');

  const extraEditorButtons = isEditorVisible
    ? [
        <Button key="Default" type="dashed" onClick={onDefault}>
          Default
        </Button>,
        <Button key="Clear" type="danger" onClick={onClear}>
          Clear
        </Button>
      ]
    : EMPTY_EXTRA;

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
              <JsonView jsonObject={addPipelineTemplate} />
            </Card>
          </FlexItemStart>
          <FlexItemGrow as={FlexItemStart}>
            <AddPipelineForm onSubmit={onSubmit} isLastStep={isLastStep} />
          </FlexItemGrow>
        </FlexBox>
      </Display>

      <BottomContent.Divider />
      <StepsBottom type="navigation" size="small" current={step} onChange={setStep}>
        {steps}
      </StepsBottom>

      <BottomContent.Divider />
      <BottomContent
        width={DRAWER_SIZE.ADD_PIPELINE}
        extra={[
          <Button key="Editor" onClick={toggle}>
            {isEditorVisible ? 'Wizard' : 'Editor'} View
          </Button>,
          ...extraEditorButtons
        ]}
      >
        {!isEditorVisible && (
          <Button disabled={!step} onClick={onPrevClick}>
            <Icon type="left" />
            Back
          </Button>
        )}
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
