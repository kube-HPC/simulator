import React, { useState, useReducer, useCallback } from 'react';
import { addPipelineTemplate } from 'config';
import { WIZARD_STATE } from 'const';
import PropTypes from 'prop-types';
import { useWizardAddPipeline } from 'hooks';
import { Form } from 'antd';
import Editor from './Editor';
import Wizard from './Wizard';

const AddPipeline = ({ jsonPipeline, isRunPipeline }) => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState(WIZARD_STATE.IDLE);
  const [isEditorVisible, toggle] = useReducer(visible => !visible, false);
  const [editorState, setEditorState] = useState(addPipelineTemplate);
  const [wizardStepIdx, setWizardStepIdx] = useState(0);
  const [isEdit] = useState(jsonPipeline !== undefined);

  const { handleSubmit } = useWizardAddPipeline(
    jsonPipeline,
    status,
    isEdit,
    setEditorState,
    setStatus,
    form,
    setWizardStepIdx,
    editorState,
    addPipelineTemplate,
    isRunPipeline
  );

  const wizardClear = useCallback(() => {
    setStatus(WIZARD_STATE.CLEAR);
  }, [setStatus]);

  if (status === WIZARD_STATE.IDLE) return null;

  return isEditorVisible ? (
    <Editor
      toggle={toggle}
      onSubmit={handleSubmit}
      initialState={editorState}
      setEditorState={setEditorState}
      isEdit={isEdit}
      isRunPipeline={isRunPipeline}
    />
  ) : (
    <Wizard
      form={form}
      toggle={toggle}
      onSubmit={handleSubmit}
      initialState={editorState}
      setEditorState={setEditorState}
      setStepIdx={setWizardStepIdx}
      stepIdx={wizardStepIdx}
      wizardClear={wizardClear}
      isEdit={isEdit}
      isRunPipeline={isRunPipeline}
    />
  );
};

AddPipeline.defaultProps = {
  jsonPipeline: undefined,
  isRunPipeline: false,
};
AddPipeline.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  jsonPipeline: PropTypes.string,
  isRunPipeline: PropTypes.bool,
};

export default AddPipeline;
