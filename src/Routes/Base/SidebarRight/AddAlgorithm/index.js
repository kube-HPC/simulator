import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { BottomContent, Card, JsonEditor } from 'components/common';
import { addAlgorithmTemplate } from 'config';
import { DRAWER_SIZE } from 'const';
import { useActions } from 'hooks';
import { Display } from 'styles';
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

  return (
    <>
      <Display isVisible={!editorIsVisible}>
        <AddAlgorithmForm
          isVisible={!editorIsVisible}
          onToggle={toggleEditor}
          onSubmit={onSubmit}
        />
      </Display>
      <Display isVisible={editorIsVisible}>
        <Card>
          <JsonEditor value={editorValue} onChange={setEditorValue} />
        </Card>
        <BottomContent.Divider />
        <BottomContent
          width={DRAWER_SIZE.ADD_ALGORITHM}
          extra={[
            <Button key="editor" onClick={toggleEditor}>
              Form View
            </Button>,
            <Button key="default" type="dashed" onClick={onDefault}>
              Default
            </Button>,
            <Button key="clear" type="danger" onClick={onClear}>
              Clear
            </Button>,
          ]}>
          <Button key="Submit" type="primary" onClick={onEditorSubmit}>
            Submit
          </Button>
        </BottomContent>
      </Display>
    </>
  );
};

AddAlgorithm.propTypes = {
  // eslint-disable-next-line
  onSubmit: PropTypes.func,
};

export default memo(AddAlgorithm);
