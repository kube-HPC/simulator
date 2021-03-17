import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles';
import { DRAWER_SIZE } from 'const';
import { JsonEditor } from 'components/common';
import { tryParse, stringify } from 'utils';
import { addPipelineTemplate } from 'config';
import {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
} from 'components/Drawer';

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);

const JsonViewWrapper = styled.div`
  border: 1px solid ${COLOR_LAYOUT.border};
  border-bottom: none;
  flex: 1;
`;

const Editor = ({ toggle, onSubmit, initialState, setEditorState }) => {
  const [innerState, setInnerState] = useState(
    JSON.stringify(initialState, null, 4)
  );

  const onEditorSubmit = () =>
    tryParse({
      src: innerState,
      onSuccess: ({ parsed }) => {
        onSubmit(parsed);
      },
    });

  const onDefault = () => setInnerState(INITIAL_EDITOR_VALUE);
  const onClear = () => setInnerState('');

  const handleToggle = () =>
    tryParse({
      src: innerState,
      onSuccess: ({ parsed }) => {
        setEditorState(parsed);
        toggle();
      },
    });

  return (
    <>
      <JsonViewWrapper>
        <JsonEditor
          value={innerState}
          onChange={setInnerState}
          height="100%"
          width="100%"
        />
      </JsonViewWrapper>

      <BottomPanel width={DRAWER_SIZE.ADD_PIPELINE}>
        <PanelButton key="Editor" onClick={handleToggle}>
          Wizard View
        </PanelButton>
        <PanelButton
          type="dashed"
          onClick={onDefault}
          style={{ margin: '0 1ch' }}>
          Default
        </PanelButton>
        <PanelButton type="danger" onClick={onClear}>
          Clear
        </PanelButton>
        <RightAlignedButton
          type="primary"
          onClick={onEditorSubmit}
          form="add-pipeline"
          htmlType="submit">
          Submit
          <Icon type="check" />
        </RightAlignedButton>
      </BottomPanel>
    </>
  );
};

Editor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  // eslint-disable-next-line
  initialState: PropTypes.object.isRequired,
};

export default Editor;
