import React from 'react';
import DrawerOperations from 'components/Drawer/DrawerOperations.react';
import AddPipeline from 'components/Sidebar/SidebarRight/AddPipeline/AddPipeline.react';
import { SB_SECTIONS } from 'const';

export default {
  title: `${SB_SECTIONS.RIGHT}|Add Pipeline`,
};

export const InDrawer = () => (
  <DrawerOperations visible={true} operation={'Add Pipeline'}>
    <AddPipeline />
  </DrawerOperations>
);
