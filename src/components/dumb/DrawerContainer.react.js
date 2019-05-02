import React, { useState } from 'react';
import { Drawer, Button } from 'antd';

const DrawerContainer = ({ visible, onClose, children }) => (
  <Drawer width={'120vh'} placement="right" visible={visible} closable={false} onClose={onClose}>
    {children}
  </Drawer>
);

export default DrawerContainer;
