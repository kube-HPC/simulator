import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Steps, Form as AntdForm } from 'antd';
import { JsonView } from 'components/common';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { BottomPanel, PanelButton, RightAlignedBox } from 'components/Drawer';
import { useWizard } from 'hooks';
import { context } from './useWizardContext';
import { Initial, Nodes, Options } from './Steps';
import GraphPreview from './../../Tables/Jobs/GridView/GraphPreview';

const Form = styled(AntdForm)`
  width: 88ch;
  height: 100%;
  overflow-y: scroll;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: row;
  // overflow-y: scroll;
  height: ${props => (props.$isEditState ? '81%' : '81%')};
`;

export const ContenerWizard = styled.div`
  // position: relative;
  // overflow-x: none;
  //overflow-y: scroll;
  // height: 100%;
  // width: 50%;
`;

export const ContenerJsonGraph = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const ContenerJsonButton = styled.div`
  flex: 1;

  overflow-y: scroll;
`;

export const ContenerGraph = styled.div`
  position: relative;
  flex: 1;

  // overflow-y: scroll;
  padding-left: 10px;
`;

export const ButtonSticky = styled(Button)`
right: 0;
    position: absolute;
    margin-right: 10px;
    z-index:999;
}
`;

export const ButtonRun = styled(Button)`
  margin-left: 20px;
`;
const stepNames = ['Initial', 'Nodes', 'Options'];
const RunPipelineStepNames = ['Initial', 'Options', 'Nodes Info'];

const stepComponents = [Initial, Nodes, Options];
const RunPipelineStepComponents = [Initial, Options, Nodes];

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
  isRunPipeline,
}) => {
  const [initStepNames] = useState(
    isRunPipeline ? RunPipelineStepNames : stepNames
  );
  const [initStepComponents] = useState(
    isRunPipeline ? RunPipelineStepComponents : stepComponents
  );

  const steps = useMemo(
    () =>
      initStepNames.map(name => ({
        key: `steps-${name}`,
        title: name,
      })),
    [initStepNames]
  );

  const firstUpdateWizard = useRef(true);

  const [valuesState, setValuesState] = useState(() => initialState);
  const { getFieldValue } = form;

  const {
    setForm,
    handleSubmit,
    getFormattedFormValues,
    resetKind,
    persistForm,
  } = useWizard(
    form,
    initialState,
    onSubmit,
    setEditorState,
    setValuesState,
    isRunPipeline
  );

  const handleToggle = useCallback(() => {
    persistForm();
    toggle();
  }, [persistForm, toggle]);

  // check for undefined to avoid removing streaming only fields while initial load

  const isStreamingPipeline =
    ['stream'].includes(getFieldValue('kind')) || valuesState.kind === 'stream';

  const isLastStep = stepIdx === steps.length - 1;

  const onPrevious = useCallback(() => setStepIdx(state => state - 1), [
    setStepIdx,
  ]);

  const onNext = useCallback(() => setStepIdx(state => state + 1), [
    setStepIdx,
  ]);

  useEffect(() => {
    // if kind is undefined then is value default algorithm
    resetKind(undefined);
  }, []);

  useLayoutEffect(() => {
    if (firstUpdateWizard.current) {
      firstUpdateWizard.current = false;
    } else {
      // remove gateway or output option from nodes and reset them to algorithm option
      resetKind(
        isStreamingPipeline ? ['output', 'hyperparamsTuner'] : ['gateway']
      );
    }
  }, [isStreamingPipeline, resetKind]);

  return (
    <context.Provider
      value={{
        form,
        stepIdx,
        initialState,
        isStreamingPipeline,
        isEdit,
        valuesState,
        isRunPipeline,
        setForm,
      }}>
      <Steps
        items={steps}
        type="navigation"
        size="small"
        current={stepIdx}
        onChange={setStepIdx}
        style={{
          borderBottom: `1px solid ${COLOR_LAYOUT.border}`,
          marginBottom: '20px',
          paddingTop: '0px',
        }}
      />
      <Body $isEditState={isEdit}>
        <ContenerWizard>
          <Form
            form={form}
            onValuesChange={setForm}
            name="create-pipeline"
            layout="horizontal"
            hideRequiredMark
            onSubmit={handleSubmit}
            style={{ padding: '0 2ch' }}>
            {initStepComponents.map((StepComponent, ii) => (
              <StepComponent
                key={`step-component-${stepNames[ii]}`}
                style={{
                  display: ii === stepIdx ? 'block' : 'none',
                }}
              />
            ))}
          </Form>
        </ContenerWizard>

        <ContenerJsonGraph>
          <ContenerGraph>
            {valuesState && (
              <GraphPreview
                pipeline={valuesState}
                isBuildAllFlows={isStreamingPipeline}
                isMinified
              />
            )}
          </ContenerGraph>

          <ContenerJsonButton>
            <ButtonSticky onClick={handleToggle}>Text editor</ButtonSticky>
            <JsonView src={getFormattedFormValues()} collapsed={undefined} />
          </ContenerJsonButton>
        </ContenerJsonGraph>
      </Body>

      <BottomPanel>
        <PanelButton disabled={stepIdx === 0} onClick={onPrevious}>
          <LeftOutlined />
          Back
        </PanelButton>

        {!isRunPipeline && (
          <PanelButton type="dashed" onClick={wizardClear}>
            Reset
          </PanelButton>
        )}

        <RightAlignedBox>
          {(!isRunPipeline || (isRunPipeline && !isLastStep)) && (
            <Button
              type={isLastStep ? 'primary' : 'default'}
              onClick={!isLastStep ? onNext : handleSubmit}
              form="create-pipeline"
              htmlType="submit">
              {isLastStep ? 'Submit' : 'Next'}
              {isLastStep ? <CheckOutlined /> : <RightOutlined />}
            </Button>
          )}

          {isRunPipeline && (
            <ButtonRun
              type="primary"
              onClick={handleSubmit}
              form="create-pipeline"
              htmlType="submit">
              Run
              <CheckOutlined />
            </ButtonRun>
          )}
        </RightAlignedBox>
      </BottomPanel>
    </context.Provider>
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
  isRunPipeline: PropTypes.bool.isRequired,
};

export default Wizard;
