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
import useIds from './Steps/Nodes/useIds.js';
import GraphPreview from './../../Tables/Jobs/GridView/GraphPreview';

const Form = styled(AntdForm)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: row;
  height: ${props => (props.$isEditState ? '81%' : '81%')};

  .ant-splitter {
    height: 100%;

    .ant-splitter-panel {
      overflow: hidden;
    }
  }
`;

export const ContenerWizard = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  height: 100%;
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

const MainContentContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const FixedNodeList = styled.div`
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid ${COLOR_LAYOUT.border};
`;

const ResizableContentArea = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
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

  // Add shared activeNodeId state for Nodes step
  const [activeNodeId, setActiveNodeId] = useState(0);
  const [ids, appendKey, dropKey, reloadIds] = useIds(
    Object.keys(initialState.nodes)
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
    setIsStreamingPipeline(
      ['stream'].includes(getFieldValue('kind')) ||
        valuesState.kind === 'stream'
    );

    resetKind(undefined);

    setTimeout(() => {
      setPageLoaded(true);
    }, 500);
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

  // Check if current step is Nodes to apply special layout
  const isNodesStep = stepIdx === 1;

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
        activeNodeId,
        setActiveNodeId,
        ids,
        appendKey,
        dropKey,
        reloadIds,
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
        {isNodesStep ? (
          // Special layout for Nodes step with three columns
          <MainContentContainer>
            {/* Fixed Node List - Always 280px */}
            <FixedNodeList>
              <Form
                form={form}
                onValuesChange={setForm}
                name="create-pipeline"
                layout="horizontal"
                hideRequiredMark
                onSubmit={handleSubmit}
                style={{ padding: '0 1ch', height: '100%' }}>
                <Nodes
                  style={{ display: 'block', height: '100%' }}
                  isFixedLayout
                />
              </Form>
            </FixedNodeList>

            {/* Resizable area between Node Editing and Graph/JSON */}
            <ResizableContentArea>
              <Splitter
                layout="horizontal"
                onResizeEnd={() => setReloadGraphPreview(!reloadGraphPreview)}
                style={{ height: '100%', flex: 1 }}>
                {/* Node Editing Area - Resizable */}
                <Splitter.Panel
                  defaultSize="45%"
                  minSize="30%"
                  maxSize="70%"
                  style={{ overflow: 'hidden' }}>
                  <ContenerWizard>
                    <Form
                      form={form}
                      onValuesChange={setForm}
                      name="create-pipeline-editing"
                      layout="horizontal"
                      hideRequiredMark
                      onSubmit={handleSubmit}
                      style={{ padding: '0 2ch', height: '100%' }}>
                      <Nodes
                        style={{ display: 'block', height: '100%' }}
                        isEditingArea
                      />
                    </Form>
                  </ContenerWizard>
                </Splitter.Panel>

                {/* Graph/JSON Area - Resizable */}
                <Splitter.Panel style={{ overflow: 'hidden' }}>
                  {pageLoaded && (
                    <ContenerJsonGraph>
                      <Splitter
                        lazy
                        onResizeEnd={() =>
                          setReloadGraphPreview(!reloadGraphPreview)
                        }
                        layout="vertical"
                        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <Splitter.Panel defaultSize="60%" minSize="40%">
                          <ContenerGraph>
                            {valuesState && (
                              <GraphPreview
                                pipeline={valuesState}
                                isBuildAllFlows={isStreamingPipeline}
                                isMinified
                                clickNode={selectNodeFromGraph}
                                reload={reloadGraphPreview}
                              />
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
            </ResizableContentArea>
          </MainContentContainer>
        ) : (
          // Normal layout for other steps (Initial, Options)
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
                    height: '100%',
                  }}
                />
              ))}
            </Form>
          </ContenerWizard>
        )}
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
