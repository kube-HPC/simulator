import React, { memo } from 'react';
import { Drawer } from 'components/Drawer';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { useActions } from 'hooks';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { body, footer, ...props },
  } = useSelector(state => state[STATE_SOURCES.DRAWER]);

  const { drawerToggle } = useActions();

  return (
    <Drawer {...props} visible={isVisible} onClose={drawerToggle} bottomContent={footer}>
      {body}
    </Drawer>
  );
};

export default memo(DashboardDrawer);
