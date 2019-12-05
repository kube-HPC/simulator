import { Button, Typography } from 'antd';
import MdEditor from 'components/common/Markdown/MdEditor/MdEditor.react';
import Drawer from 'components/Drawer/Drawer.react';
import addPipelineTemplate from 'config/template/addPipeline.template';
import React from 'react';
import { stringify } from 'utils/string';
import { SB_SECTIONS } from 'const';
import { DrawerEditorMD } from 'components';

export default {
  title: `${SB_SECTIONS.MARKDOWN}Markdown Editor`,
};

const source = `An **example** of writing a _markdown_`;

const config = { message: 'Update Algorithm' };

export const Default = () => <MdEditor value={source} />;
export const Empty = () => <MdEditor value={undefined} config={config} />;

export const InDrawer = () => (
  <Drawer visible={true}>
    <MdEditor value={source} />
  </Drawer>
);

export const DrawerEditorComponent = () => (
  <DrawerEditorMD
    title={'Update Pipeline'}
    description={
      <>
        Edit pipeline properties and <Typography.Text code>Update</Typography.Text>
      </>
    }
    valueString={stringify(addPipelineTemplate)}
    submitText={'Update'}
    opener={setVisible => <Button onClick={setVisible}>Open Drawer</Button>}
  />
);
