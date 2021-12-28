import React, { useCallback, useEffect, useState } from 'react';
import { pickBy, identity } from 'lodash';
import { Steps } from 'antd';
import {
  Initial,
  Nodes,
  Options,
} from './../Routes/SidebarRight/AddPipeline/Steps';
import useSubscribe from './../Routes/SidebarRight/useSubscribe';

const pruneObject = obj => pickBy(obj, identity);
const stepNames = ['Initial', 'Nodes', 'Options'];
const stepComponents = [Initial, Nodes, Options];
const steps = stepNames.map(name => (
  <Steps.Step key={`steps-${name}`} title={name} />
));

/** @param {[any]} collection */
const normalize = collection =>
  collection.reduce((acc, item, ii) => ({ ...acc, [ii]: item }), {});

// converts arrays to objects on selected fields to match ant requirement
// eslint-disable-next-line no-unused-vars
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

const useWizard = (
  form,
  initialState,
  stepIdx,
  setStepIdx,
  toggle,
  onSubmit,
  setEditorState
) => {
  const [valuesState, setValuesState] = useState({});
  const { setFieldsValue, getFieldsValue, getFieldValue } = form;
  const { subscribe } = useSubscribe();

  useEffect(() => {
    setFieldsValue(pruneObject(initialState));
  }, [setFieldsValue, initialState]);

  const getFormattedFormValues = useCallback(() => {
    const formValues = getFieldsValue();
    delete formValues.listKeyValue;

    const nodes = Object.values(formValues?.nodes || {})
      .filter(item => item?.kind)
      .map(item => {
        if (!item?.input) return item;
        return {
          ...item,
          input: Object.values(item?.input),
        };
      });

    return pruneObject({ ...formValues, nodes });
  }, [getFieldsValue]);

  const persistForm = useCallback(() => {
    setEditorState(getFormattedFormValues());
  }, [setEditorState, getFormattedFormValues]);

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

  const resetKind = useCallback(
    typeKind => {
      const { nodes } = getFieldsValue();
      nodes &&
        nodes.forEach((node, index) => {
          if (node?.kind === typeKind) {
            nodes[index].kind = 'algorithm';
            setFieldsValue({ nodes });
          }
        });
    },
    [getFieldsValue, setFieldsValue]
  );

  useEffect(() => {
    // remove gateway or output option from nodes and reset them to algorithm option
    if (isStreamingPipeline) resetKind('output');
    else resetKind('gateway');
  }, [isStreamingPipeline, resetKind]);

  const setForm = useCallback(() => {
    setValuesState(getFormattedFormValues());
  }, [getFormattedFormValues, setValuesState]);

  return {
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
  };
};

export default useWizard;
