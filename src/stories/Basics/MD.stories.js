import React from 'react';
import { storiesOf } from '@storybook/react';

import { Tabs, Button, Typography } from 'antd';

import MDEditor from 'components/common/md/MDEditor.react';
import DrawerContainer from 'components/common/drawer/DrawerContainer.react';
import DrawerEditorMD from 'components/common/drawer/DrawerEditorMD.react';
import addPipelineTemplate from 'config/template/addPipeline.template';
import { stringify } from 'utils/string';

storiesOf('BASICS|Markdown', module)
  .add('Editor', () => <MDEditor />)
  .add('Drawer', () => (
    <DrawerContainer visible={true}>
      <MDEditor />
    </DrawerContainer>
  ))
  .add('Tabs', () => (
    <Tabs
      tabBarExtraContent={
        <DrawerContainer
          visible={true}
          opener={isVisible => {
            return <Button onClick={isVisible}>Open</Button>;
          }}
        >
          <MDEditor data={'Hello\nWorld'} />
        </DrawerContainer>
      }
    >
      <Tabs.TabPane tab="Tab1" key="Tab1">
        Tab1
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab2" key="Tab2">
        Tab2
      </Tabs.TabPane>
    </Tabs>
  ))
  .add('DrawerEditorMD', () => (
    <DrawerEditorMD
      title={'Update Pipeline'}
      description={
        <>
          Edit pipeline properties and{' '}
          <Typography.Text code>Update</Typography.Text>
        </>
      }
      visible
      valueString={stringify(addPipelineTemplate)}
      onSubmit={e => console.log(e)}
      submitText={'Update'}
    />
  ));
