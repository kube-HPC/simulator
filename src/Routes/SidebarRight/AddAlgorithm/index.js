import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
} from 'components/Drawer';
import { Card, JsonEditor } from 'components/common';
import { addAlgorithmTemplate } from 'config';
import { useActions } from 'hooks';
import { stringify } from 'utils';
import tryParse from 'utils/handleParsing';
import AddAlgorithmForm from './AddAlgorithmForm.react';

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);
const noop = () => {};

const AddAlgorithm = ({ onSubmit = noop }) => {
  // #region  Editor State
  const [editorIsVisible, setEditorIsVisible] = useState(false);
  const [editorValue, setEditorValue] = useState(DEFAULT_EDITOR_VALUE);

  const toggleEditor = () => setEditorIsVisible(prev => !prev);

  const onClear = () => setEditorValue(``);
  const onDefault = () => setEditorValue(DEFAULT_EDITOR_VALUE);

  const { applyAlgorithm } = useActions();
  // #endregion

  // #region Handle submit
  const apply = payload => applyAlgorithm(payload);

  const onSuccess = ({ src }) => {
    const formData = new FormData();
    formData.append(`payload`, src);
    onSubmit({ payload: src });
    apply(formData);
  };

  const onEditorSubmit = () => tryParse({ src: editorValue, onSuccess });
  // #endregion

  return editorIsVisible ? (
    <>
      <Card style={{ flex: 1 }} bodyStyle={{ height: '100%' }}>
        <JsonEditor value={editorValue} onChange={setEditorValue} />
      </Card>
      <BottomPanel>
        <PanelButton key="editor" onClick={toggleEditor}>
          Form View
        </PanelButton>
        <PanelButton key="default" type="dashed" onClick={onDefault}>
          Default
        </PanelButton>
        <PanelButton key="clear" type="danger" onClick={onClear}>
          Clear
        </PanelButton>
        <RightAlignedButton
          key="Submit"
          type="primary"
          onClick={onEditorSubmit}>
          Submit
        </RightAlignedButton>
      </BottomPanel>
    </>
  ) : (
    <AddAlgorithmForm onToggle={toggleEditor} onSubmit={onSubmit} />
  );
};

AddAlgorithm.propTypes = {
  // eslint-disable-next-line
  onSubmit: PropTypes.func,
};

export default memo(AddAlgorithm);

// <BottomContent.Divider />
// <BottomContent
//   width={DRAWER_SIZE.ADD_ALGORITHM}
//   extra={[
//   ]}>
//
// </BottomContent>
