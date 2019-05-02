import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Layout, Icon, Menu } from 'antd';

const SiderLight = styled(Layout.Sider)`
  border-left: 1px solid #e8e8e8;
`;

const addMenuItems = items =>
  items.map(([name, component]) => (
    <Menu.Item key={name} style={{ marginLeft: '-11px' }}>
      <Icon type={component} component={component} style={{ fontSize: '20px' }} />
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
          ['AddPipeline', 'file-add'],
          ['AddAlgorithm', 'folder-add'],
          ['AddDebug', 'plus-circle']
        ])}
      </Menu>
    </SiderLight>
  );
}

SiderMini.propTypes = {
  onSelect: PropTypes.func.isRequired
};
