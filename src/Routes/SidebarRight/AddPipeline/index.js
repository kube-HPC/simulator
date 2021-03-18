import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import cleanDeep from 'clean-deep';
import Wizard from './Wizard';
import Editor from './Editor';

/** @param {import('./fields').DataSourceNode} node */
const formatDataSourceNode = node =>
  // if used datasource by id, avoid all other parameters
  node?.dataSource?.id
    ? {
        ...node,
        dataSource: {
          id: node?.dataSource?.id,
        },
      }
    : node;

/** @param {import('./fields').AlgorithmNode} node */
const formatAlgorithmNode = node => {
  const { kind, ...rest } = node;
  return rest;
};

const formats = {
  dataSource: formatDataSourceNode,
  algorithm: formatAlgorithmNode,
};

/** @param {import('./fields').Node} node */
const formatNode = node => {
  const formatter = formats[node.kind];
  return formatter ? formatter(node) : node;
};

const AddPipeline = () => {
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [wizardStepIdx, setWizardStepIdx] = useState(0);
  const { addPipeline } = useActions();
  const didNotLoadState = editorState === addPipelineTemplate;

  useEffect(() => {
    // avoid infinite looping
    if (didNotLoadState) {
      const rawData = window.localStorage.getItem('add-pipeline-form-state');
      try {
        const parsedState = JSON.parse(rawData);
        if (parsedState) setEditorState(parsedState);
      } catch (error) {
        console.info('did not load form state from storage');
      }
    }

    return () => {
      // avoid infinite looping
      if (didNotLoadState) return;
      window.localStorage.setItem(
        'add-pipeline-form-state',
        JSON.stringify(editorState)
      );
    };
  }, [setEditorState, editorState, didNotLoadState]);

  const handleSubmit = useCallback(
    formData => {
      /** @type {import('./fields').PipelineDescriptor} */
      const formattedData = {
        ...formData,
        nodes: formData.nodes.map(formatNode),
      };
      addPipeline(cleanDeep(formattedData));
    },
    [addPipeline]
  );

  if (didNotLoadState) return null;
  return isEditorVisible ? (
    <Editor
      toggle={toggle}
      onSubmit={handleSubmit}
      initialState={editorState}
      setEditorState={setEditorState}
    />
  ) : (
    <Wizard
      toggle={toggle}
      onSubmit={handleSubmit}
      initialState={editorState}
      setEditorState={setEditorState}
      setStepIdx={setWizardStepIdx}
      stepIdx={wizardStepIdx}
    />
  );
};

export default AddPipeline;
