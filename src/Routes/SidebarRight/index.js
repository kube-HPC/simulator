import React from 'react';
import { USER_GUIDE } from 'const';
import Bar from './Bar';

export { default as Drawer } from './Drawer';

const SideBarRight = () => (
  <>
    <Bar className={USER_GUIDE.SIDEBAR_TOP_RIGHT} isTop />
    <Bar className={USER_GUIDE.SIDEBAR_BOTTOM_RIGHT} />
  </>
);

export default SideBarRight;
