import React from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Steps, Form as AntdForm } from 'antd';
import { JsonView } from 'components/common';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import {
  BottomPanel,
  PanelButton,
  RightAlignedButton,
} from 'components/Drawer';
import { useWizard } from 'hooks';
import { context } from './useWizardContext';

const Form = styled(AntdForm)`
  width: 90ch;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;

  overflow-y: scroll;
  max-height: 81vh;
`;

/** @param {object} props */
/** @param {import('antd/lib/form').FormProps} props.form */
const Wizard = ({
  toggle,
  form,
  onSubmit,
  initialState,
  setEditorState,
  setStepIdx,
  stepIdx,
  wizardClear,
  isEdit,
}) => {
  const {
    steps,
    setForm,
    handleSubmit,
    isStreamingPipeline,
    valuesState,
    stepComponents,
    stepNames,
    getFormattedFormValues,
    handleToggle,
    onPrevious,
    isLastStep,
    onNext,
  } = useWizard(
    form,
    initialState,
    stepIdx,
    setStepIdx,
    toggle,
    onSubmit,
    setEditorState
  );

  return (
    <>
      <Steps
        type="navigation"
        size="small"
        current={stepIdx}
        onChange={setStepIdx}
        style={{
          borderBottom: `1px solid ${COLOR_LAYOUT.border}`,
          marginBottom: '20px',
          paddingTop: '0px',
        }}>
        {steps}
      </Steps>

      <Body>
        <Form
          form={form}
          onValuesChange={setForm}
          name="create-pipeline"
          layout="horizontal"
          hideRequiredMark
          onSubmit={handleSubmit}
          style={{ padding: '0 2ch' }}>
          <context.Provider
            value={{
              form,
              initialState,
              isStreamingPipeline,
              isEdit,
              valuesState,
            }}>
            {stepComponents.map((StepComponent, ii) => (
              <StepComponent
                key={`step-component-${stepNames[ii]}`}
                style={{
                  display: ii === stepIdx ? 'block' : 'none',
                }}
              />
            ))}
          </context.Provider>
        </Form>
        <JsonView
          src={getFormattedFormValues()}
          collapsed={undefined}
          style={{ flex: 1 }}
        />
      </Body>

      <BottomPanel>
        <PanelButton type="danger" onClick={wizardClear}>
          Clear
        </PanelButton>
        <PanelButton onClick={handleToggle}>Editor View</PanelButton>
        <PanelButton disabled={stepIdx === 0} onClick={onPrevious}>
          <LeftOutlined />
          Back
        </PanelButton>
        <RightAlignedButton
          type={isLastStep ? 'primary' : 'default'}
          onClick={!isLastStep ? onNext : handleSubmit}
          form="create-pipeline"
          htmlType="submit">
          {isLastStep ? 'Submit' : 'Next'}
          {isLastStep ? <CheckOutlined /> : <RightOutlined />}
        </RightAlignedButton>
      </BottomPanel>
    </>
  );
};

Wizard.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  setStepIdx: PropTypes.func.isRequired,
  stepIdx: PropTypes.number.isRequired,
  // eslint-disable-next-line
  initialState: PropTypes.object.isRequired,
  // eslint-disable-next-line
  wizardClear: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default Wizard;
