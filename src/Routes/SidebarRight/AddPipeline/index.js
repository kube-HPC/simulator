import React from 'react';
import { WIZARD_STATE } from 'const';
import PropTypes from 'prop-types';
import { useWizardAddPipeline } from 'hooks';
import Editor from './Editor';
import Wizard from './Wizard';

const AddPipeline = ({ jsonPipeline }) => {
  const {
    form,
    isEdit,
    isEditorVisible,
    setWizardStepIdx,
    wizardStepIdx,
    wizardClear,
    toggle,
    handleSubmit,
    editorState,
    setEditorState,
    status,
  } = useWizardAddPipeline(jsonPipeline);

  if (status === WIZARD_STATE.IDLE) return null;

  return isEditorVisible ? (
    <Editor
      toggle={toggle}
      onSubmit={handleSubmit}
      initialState={editorState}
      setEditorState={setEditorState}
      isEdit={isEdit}
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
    />
  );
};

AddPipeline.defaultProps = {
  jsonPipeline: undefined,
};
AddPipeline.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  jsonPipeline: PropTypes.object,
};

export default AddPipeline;
