import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ color: '#999' }} />
));

export default DragHandle;
