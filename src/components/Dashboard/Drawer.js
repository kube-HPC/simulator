import { Drawer } from 'components/Drawer';
import { useActions, useDrawer } from 'hooks';
import React from 'react';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { body, footer, ...props },
  } = useDrawer();

  const { drawerToggle } = useActions();

  return (
    <Drawer
      // eslint-disable-next-line
      {...props}
      visible={isVisible}
      onClose={drawerToggle}
      bottomContent={footer}
      destroyOnClose>
      {body}
    </Drawer>
  );
};

export default DashboardDrawer;
