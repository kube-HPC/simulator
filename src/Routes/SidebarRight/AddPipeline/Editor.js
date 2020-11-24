import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DRAWER_SIZE } from 'const';
import { Button, Icon } from 'antd';
import { BottomContent, Card, JsonEditor } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import { tryParse, stringify } from 'utils';
import addPipelineTemplate from 'config/template/addPipeline.template';

const INITIAL_EDITOR_VALUE = stringify(addPipelineTemplate);
// #endregion

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
      <Card>
        <JsonEditor value={editorValue} onChange={setEditorValue} />
      </Card>
      <BottomContent.Divider />
      <BottomContent
        width={DRAWER_SIZE.ADD_PIPELINE}
        extra={[
          <Button key="Editor" onClick={toggle}>
            Wizard View
          </Button>,
          <Button type="dashed" onClick={onDefault}>
            Default
          </Button>,
          <Button type="danger" onClick={onClear}>
            Clear
          </Button>,
        ]}>
        <Button
          type="primary"
          onClick={onEditorSubmit}
          form={schema.ID}
          htmlType="submit">
          Submit
          <Icon type="check" />
        </Button>
      </BottomContent>
    </>
  );
};

Editor.propTypes = {
  addPipeline: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Editor;
