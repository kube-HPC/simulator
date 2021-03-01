import React, { useReducer, useState } from 'react';
// import { addPipelineTemplate } from 'config';
// import { useActions } from 'hooks';
import Wizard from './Wizard';
import Editor from './Editor';
import testData from './test';

const AddPipeline = () => {
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  // const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [editorState, setEditorState] = useState(testData);

  const [wizardStepIdx, setWizardStepIdx] = useState(0);

  // const { addPipeline } = useActions();
  const handleSubmit = console.log;

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
