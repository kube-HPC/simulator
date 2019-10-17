import React from 'react';
import AddDebugReact from 'components/Sidebar/SidebarRight/AddDebug.react';
import DrawerOperations from 'components/Drawer/DrawerOperations.react';
import SECTIONS from './sections';

export default {
  title: `${SECTIONS.RIGHT}|Add Debug`
};

export const InDrawer = () => (
  <DrawerOperations visible={true} operation={'Add Debug'}>
    <AddDebugReact />
  </DrawerOperations>
);
