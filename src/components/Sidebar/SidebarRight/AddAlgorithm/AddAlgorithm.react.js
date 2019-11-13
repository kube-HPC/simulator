import React, { useState, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'antd';

import { DRAWER_SIZE } from 'const';
import { BottomContent, Card, JsonEditor } from 'components/common';
import { stringify } from 'utils';
import { applyAlgorithm } from 'actions';

import { addAlgorithmTemplate } from 'config';
import AddAlgorithmForm from './AddAlgorithmForm.react';
import tryParse from 'utils/handleParsing';
import { Display } from 'styles';

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);
const noop = () => {};

const AddAlgorithm = ({ onSubmit = noop }) => {
  // #region  Editor State
  const [editorIsVisible, setEditorIsVisible] = useState(false);
  const [editorValue, setEditorValue] = useState(DEFAULT_EDITOR_VALUE);

  const toggleEditor = () => setEditorIsVisible(prev => !prev);

  const onClear = () => setEditorValue('');
  const onDefault = () => setEditorValue(DEFAULT_EDITOR_VALUE);
  // #endregion

  // #region Handle submit
  const dispatch = useDispatch();
  const apply = useCallback(payload => dispatch(applyAlgorithm(payload)), [dispatch]);

  const onSuccess = ({ src }) => {
    const formData = new FormData();
    formData.append('payload', src);
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
  onSubmit: PropTypes.func,
};

export default memo(AddAlgorithm);
