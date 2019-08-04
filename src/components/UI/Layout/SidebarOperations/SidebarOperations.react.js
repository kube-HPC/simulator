import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Layout, Icon, Menu } from 'antd';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const addMenuItems = items =>
  items.map(({ name, type, component }) => (
    <Menu.Item key={name}>
      <Icon type={type} component={component} style={centerIconStyle} />
      <span>{name}</span>
    </Menu.Item>
  ));

const SidebarOperations = ({ selectedKeys, onSelect, menuItems, ...props }) => (
  <SiderLight {...props} theme="light" collapsed={true} collapsedWidth={60}>
    <Menu
      mode="vertical"
      onSelect={({ key }) => onSelect(key)}
      style={{ marginTop: '20%' }}
      selectedKeys={[]}
    >
      {addMenuItems(menuItems)}
    </Menu>
  </SiderLight>
);

SidebarOperations.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default SidebarOperations;
