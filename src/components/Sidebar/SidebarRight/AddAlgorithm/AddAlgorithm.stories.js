import React, { useState, useReducer } from 'react';

import { JsonView } from 'components/common';
import { AddAlgorithm } from 'components/Sidebar/SidebarRight';
import { Button } from 'antd';
import { SB_SECTIONS } from 'const';
import { Drawer } from 'components/Drawer';

const Container = () => {
  const [value, setValue] = useState({ note: 'Submit First' });
  const [isOpen, toggle] = useReducer(prev => !prev, true);

  return (
    <>
      <Button onClick={toggle}>Open Drawer</Button>
      <JsonView jsonObject={value} />
      <Drawer visible={isOpen} operation={'Add Algorithm'} onClose={toggle}>
        <AddAlgorithm onSubmit={({ payload }) => setValue(payload)} />
      </Drawer>
    </>
  );
};

export default {
  title: `${SB_SECTIONS.RIGHT}|Add Algorithm`,
};

export const InDrawer = () => <Container initial={true} />;
