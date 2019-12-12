import React, { useCallback, memo } from 'react';
import { Drawer } from 'components/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import { STATE_SOURCES } from 'const';
import { drawerToggle } from 'actions';

const DashboardDrawer = () => {
  const {
    isVisible,
    content: { width, title, body, footer },
  } = useSelector(state => state[STATE_SOURCES.DRAWER]);

  const dispatch = useDispatch();
  const onClose = useCallback(() => dispatch(drawerToggle()), []);

  return (
    <Drawer
      width={width}
      visible={isVisible}
      title={title}
      onClose={onClose}
      bottomContent={footer}>
      {body}
    </Drawer>
  );
};

export default memo(DashboardDrawer);
