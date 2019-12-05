import React from 'react';
import { SB_SECTIONS } from 'const';
import DrawerEditor from './DrawerEditor.react';
import { Button } from 'antd';

export default {
  title: `${SB_SECTIONS.DRAWER}Editor`,
};

const opener = setVisible => <Button onClick={() => setVisible(p => !p)}>Open</Button>;
const title = <span>Title</span>;
const value = 'Example';

export const Default = () => <DrawerEditor value={value} opener={opener} title={title} />;
export const Open = () => (
  <DrawerEditor value={value} opener={opener} title={title} visible={true} />
);
