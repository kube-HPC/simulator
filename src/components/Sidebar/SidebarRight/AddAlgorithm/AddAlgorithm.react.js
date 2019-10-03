import React, { useState, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from 'antd';

import { DRAWER_SIZE } from 'const';
import { BottomContent, Card, JsonEditor } from 'components/common';
import { stringify } from 'utils';
import { applyAlgorithm } from 'actions';

// Direct import for auto-complete

import { addAlgorithmTemplate } from 'config';
import FormContent from './FormContent.react';
import handleParsing from 'utils/handleParsing';

// #region helpers
const Display = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const DEFAULT_EDITOR_VALUE = stringify(addAlgorithmTemplate);
// #endregion

const AddAlgorithm = ({ onSubmit }) => {
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

  const onSuccess = ({ src, parsed }) => {
    const formData = new FormData();
    formData.append('payload', src);
    onSubmit({ payload: parsed });
    apply(formData);
  };

  const onEditorSubmit = () => handleParsing({ src: editorValue, onSuccess });
  // #endregion

  return (
    <>
      <Display isVisible={!editorIsVisible}>
        <FormContent isVisible={!editorIsVisible} onToggle={toggleEditor} onSubmit={onSubmit} />
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
            </Button>
          ]}
        >
          <Button key="Submit" type="primary" onClick={onEditorSubmit}>
            Submit
          </Button>
        </BottomContent>
      </Display>
    </>
  );
};

AddAlgorithm.propTypes = {
  onSubmit: PropTypes.func
};

AddAlgorithm.defaultProps = {
  onSubmit: () => {}
};

export default memo(AddAlgorithm);
