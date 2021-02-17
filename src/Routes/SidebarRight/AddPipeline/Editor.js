import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles';
import { DRAWER_SIZE } from 'const';
import { JsonEditor } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import { tryParse, stringify } from 'utils';
import addPipelineTemplate from 'config/template/addPipeline.template';
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

const Editor = ({ toggle, addPipeline }) => {
  const [editorValue, setEditorValue] = useState(INITIAL_EDITOR_VALUE);

  const onEditorSubmit = () =>
    tryParse({
      src: editorValue,
      onSuccess: ({ parsed }) => addPipeline(parsed),
    });

  const onDefault = () => setEditorValue(INITIAL_EDITOR_VALUE);
  const onClear = () => setEditorValue('');

  return (
    <>
      <JsonViewWrapper>
        <JsonEditor
          value={editorValue}
          onChange={setEditorValue}
          height="100%"
          width="100%"
        />
      </JsonViewWrapper>

      <BottomPanel width={DRAWER_SIZE.ADD_PIPELINE}>
        <PanelButton key="Editor" onClick={toggle}>
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
          form={schema.ID}
          htmlType="submit">
          Submit
          <Icon type="check" />
        </RightAlignedButton>
      </BottomPanel>
    </>
  );
};

Editor.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Editor;
