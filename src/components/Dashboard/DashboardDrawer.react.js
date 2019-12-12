import React, { useCallback, memo } from 'react';
import { Drawer } from 'components/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { drawerToggle } from 'actions';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { body, footer, ...props },
  } = useSelector(state => state[STATE_SOURCES.DRAWER]);

  const dispatch = useDispatch();
  const onClose = useCallback(() => dispatch(drawerToggle()), []);

  return (
    <Drawer {...props} visible={isVisible} onClose={onClose} bottomContent={footer}>
      {body}
    </Drawer>
  );
};

export default memo(DashboardDrawer);
