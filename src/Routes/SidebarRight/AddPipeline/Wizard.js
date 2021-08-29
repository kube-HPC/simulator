import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CheckOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

import { Steps, Form as AntdForm } from 'antd';
import { JsonView } from 'components/common';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { pickBy, identity } from 'lodash';
import {
  BottomPanel,
  PanelButton,
  RightAlignedButton,
} from 'components/Drawer';
import { Initial, Nodes, Options } from './Steps';
import { context } from './useWizardContext';
import useSubscribe from '../useSubscribe';

const pruneObject = obj => pickBy(obj, identity);

const Form = styled(AntdForm)`
  width: 90ch;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;

  overflow-y: scroll;
  max-height: 81vh;
`;

const stepNames = ['Initial', 'Nodes', 'Options']; // 'Nodes', 'Options'
const stepComponents = [Initial, Nodes, Options];

const steps = stepNames.map(name => (
  <Steps.Step key={`steps-${name}`} title={name} />
));

/** @param {[any]} collection */
const normalize = collection =>
  collection.reduce((acc, item, ii) => ({ ...acc, [ii]: item }), {});

// converts arrays to objects on selected fields to match ant requirement
const parseInitialState = initialState => {
  const nodes =
    initialState?.nodes?.map(item =>
      !item.input
        ? item
        : {
            ...item,
            input: normalize(item.input),
          }
    ) ?? [];
  const state = {
    ...initialState,
    nodes: normalize(nodes),
  };
  return state;
};

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
}) => {
  const { setFieldsValue, getFieldsValue, getFieldValue } = form;
  const { subscribe } = useSubscribe();

  useEffect(() => {
    setFieldsValue(pruneObject(parseInitialState(initialState)));
  }, [setFieldsValue, initialState]);

  const getFormattedFormValues = useCallback(() => {
    const formValues = getFieldsValue();
    const nodes = Object.values(formValues.nodes || {})
      .filter(item => item.kind)
      .map(item => {
        if (!item.input) return item;
        return {
          ...item,
          input: Object.values(item.input),
        };
      });
    return pruneObject({ ...formValues, nodes });
  }, [getFieldsValue]);

  const persistForm = useCallback(
    () => setEditorState(getFormattedFormValues()),
    [setEditorState, getFormattedFormValues]
  );

  useEffect(() => subscribe(persistForm), [subscribe, persistForm]);

  const isLastStep = stepIdx === steps.length - 1;

  const onPrevious = useCallback(() => setStepIdx(state => state - 1), [
    setStepIdx,
  ]);

  const onNext = useCallback(() => setStepIdx(state => state + 1), [
    setStepIdx,
  ]);

  const handleToggle = useCallback(() => {
    persistForm();
    toggle();
  }, [persistForm, toggle]);

  const handleSubmit = useCallback(
    e => {
      e?.preventDefault();
      onSubmit(getFormattedFormValues());
    },
    [getFormattedFormValues, onSubmit]
  );
  // check for undefined to avoid removing streaming only fields while initial load
  const isStreamingPipeline = ['stream', undefined].includes(
    getFieldValue('kind')
  );

  useEffect(() => {
    // remove gateway option from nodes and reset them to algorithm option

    if (isStreamingPipeline === false) {
      const { nodes } = getFieldsValue();
      nodes &&
        nodes.forEach((node, index) => {
          if (node.kind === 'gateway') {
            setFieldsValue({ [`nodes.${index}.kind`]: 'algorithm' });
          }
        });
    }
  }, [isStreamingPipeline, getFieldsValue, setFieldsValue]);

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
        }}>
        {steps}
      </Steps>

      <Body>
        <Form
          form={form}
          onValuesChange={persistForm}
          name="create-pipeline"
          layout="horizontal"
          hideRequiredMark
          onSubmit={handleSubmit}
          style={{ padding: '0 2ch' }}>
          <context.Provider value={{ form, initialState, isStreamingPipeline }}>
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
          src={initialState}
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
};

export default Wizard;
