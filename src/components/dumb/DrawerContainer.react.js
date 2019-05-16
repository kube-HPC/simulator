import React from 'react';
import { Drawer } from 'antd';

const width = {
  Default: '120vh',
  'Add Algorithm': '80vh',
  'Add Debug': '20vh',
  'Build Pipeline': '50vh'
};

const DrawerContainer = ({ visible, onClose, children, operation }) => (
  <Drawer
    width={width[operation] || width.Default}
    placement="right"
    visible={visible}
    closable={false}
    onClose={onClose}
  >
    {children}
  </Drawer>
);

export default DrawerContainer;
