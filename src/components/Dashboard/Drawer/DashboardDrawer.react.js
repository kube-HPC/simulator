import { Drawer } from 'components/Drawer';
import { useActions, useDrawer } from 'hooks';
import React, { memo } from 'react';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { body, footer, ...props },
  } = useDrawer();

  const { drawerToggle } = useActions();

  return (
    <Drawer
      {...props}
      visible={isVisible}
      onClose={drawerToggle}
      bottomContent={footer}
      destroyOnClose={true}>
      {body}
    </Drawer>
  );
};

export default memo(DashboardDrawer);
