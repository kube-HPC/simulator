import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles';
import { DRAWER_SIZE } from 'const';
import { JsonEditor } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import { tryParse, stringify } from 'utils';
import addPipelineTemplate from 'config/template/addPipeline.template';
import { BottomPanel } from 'components/Drawer';

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
        <Button key="Editor" onClick={toggle}>
          Wizard View
        </Button>
        <Button type="dashed" onClick={onDefault} style={{ margin: '0 1ch' }}>
          Default
        </Button>
        <Button type="danger" onClick={onClear}>
          Clear
        </Button>
        <Button
          type="primary"
          onClick={onEditorSubmit}
          form={schema.ID}
          style={{ marginLeft: 'auto' }}
          htmlType="submit">
          Submit
          <Icon type="check" />
        </Button>
      </BottomPanel>
    </>
  );
};

Editor.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Editor;
