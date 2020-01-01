import React, { memo } from 'react';
import { Drawer } from 'components/Drawer';
import { useActions, useDrawer } from 'hooks';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { body, footer, ...props },
  } = useDrawer();

  const { drawerToggle } = useActions();

  return (
    <Drawer {...props} visible={isVisible} onClose={drawerToggle} bottomContent={footer}>
      {body}
    </Drawer>
  );
};

export default memo(DashboardDrawer);
