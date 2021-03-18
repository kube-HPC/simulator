import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Steps, Form as AntdForm } from 'antd';
import { JsonView } from 'components/common';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles';
import { pickBy, identity, get } from 'lodash';
import template from 'config/template/addPipeline.template';
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
  width: 70ch;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  height: 0;
`;

const stepNames = ['Initial', 'Nodes', 'Options'];
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
  onSubmit,
  initialState,
  setEditorState,
  form,
  setStepIdx,
  stepIdx,
}) => {
  const { setFieldsValue, getFieldsValue, getFieldDecorator } = form;
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

  // NOTE:: this is a workaround!
  // filtering unchanged values removes the initial values from the form
  const fieldDecorator = useCallback(
    /** @type {typeof getFieldDecorator} */
    (field, props) =>
      getFieldDecorator(field, {
        initialValue: get(template, field),
        ...props,
      }),
    [getFieldDecorator]
  );

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

  return (
    <>
      <Body>
        <JsonView
          src={getFormattedFormValues()}
          collapsed={undefined}
          style={{ flex: 1, overflow: 'auto' }}
        />
        <Form
          layout="horizontal"
          hideRequiredMark
          onSubmit={handleSubmit}
          style={{ overflow: 'auto', padding: '0 2ch' }}>
          <context.Provider value={{ form, initialState, fieldDecorator }}>
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
      </Body>
      <Steps
        type="navigation"
        size="small"
        current={stepIdx}
        onChange={setStepIdx}
        style={{ borderTop: `1px solid ${COLOR_LAYOUT.border}` }}>
        {steps}
      </Steps>

      <BottomPanel>
        <PanelButton onClick={handleToggle}>Editor View</PanelButton>
        <PanelButton disabled={stepIdx === 0} onClick={onPrevious}>
          <Icon type="left" />
          Back
        </PanelButton>
        <RightAlignedButton
          type={isLastStep ? 'primary' : 'default'}
          onClick={!isLastStep ? onNext : handleSubmit}
          form="create-pipeline"
          htmlType="submit">
          {isLastStep ? 'Submit' : 'Next'}
          <Icon type={isLastStep ? 'check' : 'right'} />
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
    getFieldDecorator: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  setStepIdx: PropTypes.func.isRequired,
  stepIdx: PropTypes.number.isRequired,
  // eslint-disable-next-line
  initialState: PropTypes.object.isRequired,
};

export default Form.create({ name: 'create-pipeline' })(Wizard);
