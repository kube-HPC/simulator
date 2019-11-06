import { Button, Typography } from 'antd';
import MDEditor from 'components/common/md/MDEditor.react';
import Drawer from 'components/Drawer/Drawer.react';
import DrawerEditorMD from 'components/Drawer/DrawerEditorMD.react';
import addPipelineTemplate from 'config/template/addPipeline.template';
import React from 'react';
import { stringify } from 'utils/string';
import { SB_SECTIONS } from 'const';

export default {
  title: `${SB_SECTIONS.COMMON}|Markdown Editor`
};

export const Default = () => <MDEditor />;

export const InDrawer = () => (
  <Drawer visible={true}>
    <MDEditor />
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
    onSubmit={console.log}
    submitText={'Update'}
    opener={setVisible => <Button onClick={setVisible}>Open Drawer</Button>}
  />
);
