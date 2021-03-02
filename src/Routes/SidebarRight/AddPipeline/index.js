import React, { useCallback, useReducer, useState } from 'react';
import { addPipelineTemplate } from 'config';
import { useActions } from 'hooks';
import cleanDeep from 'clean-deep';
import Wizard from './Wizard';
import Editor from './Editor';

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
const formatAlgorithmNode = node => {
  const { kind, ...rest } = node;
  return rest;
};

const formatNode = node => {
  switch (node.kind) {
    case 'dataSource':
      return formatDataSourceNode(node);
    case 'algorithm':
      return formatAlgorithmNode(node);
    default:
      return node;
  }
};

const AddPipeline = () => {
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [wizardStepIdx, setWizardStepIdx] = useState(1);
  const { addPipeline } = useActions();
  const handleSubmit = useCallback(
    formData => {
      const formattedData = {
        ...formData,
        nodes: formData.nodes.map(formatNode),
      };
      addPipeline(cleanDeep(formattedData));
    },
    [addPipeline]
  );

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
