import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import cleanDeep from 'clean-deep';
import Wizard from './Wizard';
import Editor from './Editor';
import packageJson from './../../../../package.json';

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

const LOCAL_STORAGE_KEY = 'add-pipeline-form-state';

const AddPipeline = () => {
  const [status, setStatus] = useState('IDLE');
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [wizardStepIdx, setWizardStepIdx] = useState(1);
  const { addPipeline } = useActions();

  useEffect(() => {
    // avoid infinite looping
    if (status === 'IDLE') {
      const rawData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      try {
        const parsedState = JSON.parse(rawData);
        if (parsedState?.stateVersion !== packageJson.version) {
          window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else if (parsedState) {
          setEditorState(parsedState);
        }
      } catch (error) {
        console.info('did not load form state from storage');
      }
      setStatus('READY');
    }

    return () => {
      // avoid infinite looping
      if (status !== 'READY') return;
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...editorState, stateVersion: packageJson.version })
      );
    };
  }, [setEditorState, editorState, status, setStatus]);

  const handleSubmit = useCallback(
    formData => {
      /** @type {import('./fields').PipelineDescriptor} */
      const formattedData = {
        ...formData,
        nodes: formData.nodes.map(formatNode),
      };
      addPipeline(cleanDeep(formattedData));
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      // prevent re-saving to localStorage
      setStatus('SUBMITTED');
    },
    [addPipeline, setStatus]
  );

  if (status === 'IDLE') return null;
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
