import React from 'react';
import AddDebugReact from 'components/Sidebar/SidebarRight/AddDebug/AddDebug.react';
import DrawerOperations from 'components/Drawer/DrawerOperations.react';
import { SB_SECTIONS } from 'const';

export default {
  title: `${SB_SECTIONS.RIGHT}|Add Debug`
};

export const InDrawer = () => (
  <DrawerOperations visible={true} operation={'Add Debug'}>
    <AddDebugReact />
  </DrawerOperations>
);
