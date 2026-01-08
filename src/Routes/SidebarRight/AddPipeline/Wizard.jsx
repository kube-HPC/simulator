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
import { Button, Steps, Form as AntdForm, Splitter } from 'antd';
import { JsonView } from 'components/common';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { BottomPanel, PanelButton, RightAlignedBox } from 'components/Drawer';
import { useWizard } from 'hooks';
import { context } from './useWizardContext';
import { Initial, Nodes, Options } from './Steps';
import GraphPreview from './../../Tables/Jobs/GridView/GraphPreview';

const Form = styled(AntdForm)`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: row;
  height: ${props => (props.$isEditState ? '81%' : '81%')};
`;

export const ContenerWizard = styled.div`
  overflow-y: scroll;
  height: 100%;
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
  height: -webkit-fill-available;
  padding-left: 10px;
`;

export const ButtonSticky = styled(Button)`
  right: 0;
  position: absolute;
  margin-right: 20px;
  margin-top: 10px;
  z-index: 999;
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
  const [valuesState, setValuesState] = useState(() => initialState);
  const [isStreamingPipeline, setIsStreamingPipeline] = useState(
    initialState.kind === 'stream'
  );
  const [pageLoaded, setPageLoaded] = useState(false);
  const [initStepNames] = useState(
    isRunPipeline ? RunPipelineStepNames : stepNames
  );
  const [initStepComponents] = useState(
    isRunPipeline ? RunPipelineStepComponents : stepComponents
  );

  const [graphNodeSelected, setGraphNodeSelected] = useState(null);
  const [reloadGraphPreview, setReloadGraphPreview] = useState(null);

  const steps = useMemo(
    () =>
      initStepNames.map(name => ({
        key: `steps-${name}`,
        title: name,
      })),
    [initStepNames]
  );

  const firstUpdateWizard = useRef(true);

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

  const isLastStep = stepIdx === steps.length - 1;

  const onPrevious = useCallback(
    () => setStepIdx(state => state - 1),
    [setStepIdx]
  );

  const onNext = useCallback(
    () => setStepIdx(state => state + 1),
    [setStepIdx]
  );

  useEffect(() => {
    const currentKind = getFieldValue('kind') || initialState.kind;
    const isStreaming = ['stream'].includes(currentKind);

    setIsStreamingPipeline(isStreaming);

    // Only reset kind if it's actually undefined
    // Don't reset on initial load with valid data to preserve pipeline structure
    if (!currentKind) {
      resetKind(undefined);
    }

    // Ensure valuesState is synchronized with initial form state
    const currentFormValues = form.getFieldsValue();
    if (currentFormValues && Object.keys(currentFormValues).length > 0) {
      setValuesState(currentFormValues);
    }

    setPageLoaded(true);
  }, []);

  useLayoutEffect(() => {
    if (firstUpdateWizard.current) {
      firstUpdateWizard.current = false;
    } else {
      resetKind(
        isStreamingPipeline ? ['output', 'hyperparamsTuner'] : ['gateway']
      );
    }
  }, [isStreamingPipeline, resetKind]);

  const selectNodeFromGraph = nodeName => {
    setStepIdx(1);
    setGraphNodeSelected(nodeName);
  };

  return (
    <context.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        form,
        stepIdx,
        initialState,
        isStreamingPipeline,
        setIsStreamingPipeline,
        isEdit,
        valuesState,
        isRunPipeline,
        setForm,
        graphNodeSelected,
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
        <Splitter>
          <Splitter.Panel>
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
          </Splitter.Panel>

          <Splitter.Panel>
            {pageLoaded && (
              <ContenerJsonGraph>
                <Splitter
                  lazy
                  onResizeEnd={() => setReloadGraphPreview(!reloadGraphPreview)}
                  layout="vertical"
                  style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                  <Splitter.Panel>
                    <ContenerGraph>
                      {valuesState &&
                      valuesState.nodes &&
                      valuesState.nodes.length > 0 ? (
                        <GraphPreview
                          pipeline={valuesState}
                          isBuildAllFlows={isStreamingPipeline}
                          isMinified
                          clickNode={selectNodeFromGraph}
                          reload={reloadGraphPreview}
                        />
                      ) : (
                        <div style={{ padding: '20px', color: '#999' }}>
                          {!valuesState
                            ? 'Loading pipeline data...'
                            : !valuesState.nodes
                              ? 'No nodes defined...'
                              : 'Waiting for pipeline data...'}
                        </div>
                      )}
                    </ContenerGraph>
                  </Splitter.Panel>
                  <Splitter.Panel>
                    <ContenerJsonButton>
                      <ButtonSticky onClick={handleToggle}>
                        Text editor
                      </ButtonSticky>
                      <JsonView
                        src={getFormattedFormValues()}
                        collapsed={undefined}
                      />
                    </ContenerJsonButton>
                  </Splitter.Panel>
                </Splitter>
              </ContenerJsonGraph>
            )}
          </Splitter.Panel>
        </Splitter>
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
