import React, { useState, useReducer } from 'react';

import { JsonView } from 'components/common';
import { AddAlgorithm } from 'components/Sidebar/SidebarRight';
import { DrawerOperations } from 'components';
import { Button } from 'antd';
import { SB_SECTIONS } from 'const';

const Container = () => {
  const [value, setValue] = useState({ note: 'Submit First' });
  const [isOpen, toggle] = useReducer(prev => !prev, true);

  return (
    <>
      <Button onClick={toggle}>Open Drawer</Button>
      <JsonView jsonObject={value} />
      <DrawerOperations visible={isOpen} operation={'Add Algorithm'} onClose={toggle}>
        <AddAlgorithm onSubmit={({ payload }) => setValue(payload)} />
      </DrawerOperations>
    </>
  );
};

export default {
  title: `${SB_SECTIONS.RIGHT}|Add Algorithm`
};

export const InDrawer = () => <Container initial={true} />;
