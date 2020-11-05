import React from 'react';
import { Button, Typography } from 'antd';
import MdEditor from 'components/common/Markdown/MdEditor/MdEditor.react';
import addPipelineTemplate from 'config/template/addPipeline.template';
import { stringify } from 'utils/string';
import { SB_SECTIONS } from 'const';
import Drawer, { DrawerEditorMD } from 'components/Drawer';

export default {
  title: `${SB_SECTIONS.MARKDOWN}Markdown Editor`,
};

const source = `An **example** of writing a _markdown_`;

const config = { message: 'Update Algorithm' };

export const Default = () => <MdEditor value={source} />;
export const Empty = () => <MdEditor value={undefined} config={config} />;

export const InDrawer = () => (
  <Drawer visible>
    <MdEditor value={source} />
  </Drawer>
);

export const DrawerEditorComponent = () => (
  <DrawerEditorMD
    title="Update Pipeline"
    description={
      <>
        Edit pipeline properties and{' '}
        <Typography.Text code>Update</Typography.Text>
      </>
    }
    valueString={stringify(addPipelineTemplate)}
    submitText="Update"
    opener={setVisible => <Button onClick={setVisible}>Open Drawer</Button>}
  />
);
