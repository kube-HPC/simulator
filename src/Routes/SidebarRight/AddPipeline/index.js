import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import cleanDeep from 'clean-deep';
import { useHistory, useParams } from 'react-router-dom';

import { message } from 'antd';
import client from 'client';
import successMsg from 'config/schema/success-messages.schema';
import packageJson from './../../../../package.json';
import Editor from './Editor';
import Wizard from './Wizard';

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
  const [wizardStepIdx, setWizardStepIdx] = useState(0);
  const { addPipeline } = useActions();
  const { root } = useParams();
  const history = useHistory();

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

  const addNewPipeline = useCallback(async data => {
    try {
      const res = await client.post('store/pipelines', { ...data });
      message.success(successMsg(res.data).PIPELINE_ADD);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      history.push(`/${root}${window.location.search}`);
    } catch (res) {
      message.error(res.response.data.error.message);
    }
  }, []);

  const handleSubmit = useCallback(
    formData => {
      /** @type {import('./fields').PipelineDescriptor} */
      const formattedData = {
        ...formData,
        nodes: formData.nodes.map(formatNode),
      };

      // addPipeline(cleanDeep(formattedData));
      addNewPipeline(cleanDeep(formattedData));

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
