import React, { useReducer } from 'react';
import { useActions } from 'hooks';
import Wizard from './Wizard';
import Editor from './Editor';

const AddPipeline = () => {
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);

  const { addPipeline } = useActions();

  return isEditorVisible ? (
    <Editor toggle={toggle} addPipeline={addPipeline} />
  ) : (
    <Wizard toggle={toggle} addPipeline={addPipeline} />
  );
};

export default AddPipeline;
