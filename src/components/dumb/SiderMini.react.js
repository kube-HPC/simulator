import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Layout, Icon, Menu } from 'antd';

import { HCOLOR } from 'constants/colors';

const SiderLight = styled(Layout.Sider)`
  border-left: 1px solid ${HCOLOR.border};
`;

const addMenuItems = items =>
  items.map(([name, component]) => (
    <Menu.Item key={name} style={{ marginLeft: '-11px' }}>
      <Icon
        type={component}
        component={component}
        style={{ fontSize: '20px' }}
      />
      <span>{name}</span>
    </Menu.Item>
  ));

export default function SiderMini({ onSelect }) {
  const [selected, setSelected] = useState([]);

  return (
    <SiderLight theme="light" collapsed={true} collapsedWidth={60}>
      <Menu
        mode="vertical"
        onSelect={i => {
          onSelect(i.key);
          setSelected([]);
        }}
        selectedKeys={selected}
      >
        {addMenuItems([
          ['Add Pipeline', 'file-add'],
          ['Add Algorithm', 'folder-add'],
          ['Add Debug', 'plus-circle']
        ])}
      </Menu>
    </SiderLight>
  );
}

SiderMini.propTypes = {
  onSelect: PropTypes.func.isRequired
};
