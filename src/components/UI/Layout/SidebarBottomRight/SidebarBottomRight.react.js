import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon, Menu } from 'antd';
import 'styles/SidebarBottomRight.react.css';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const menuItems = [
  {
    name: 'Error Logs',
    type: 'warning'
  }
];

const addMenuItems = items =>
  items.map(({ name, type, component }) => (
    <Menu.Item key={name}>
      <Icon type={type} component={component} style={centerIconStyle} />
      <span>{name}</span>
    </Menu.Item>
  ));

const SidebarBottomRight = ({ onSelect, selectedKeys, ...props }) => (
  <SiderLight {...props} theme="light" collapsed={true} collapsedWidth={60}>
    <Menu
      selectedKeys={selectedKeys}
      mode="vertical"
      onSelect={({ key }) => onSelect(key)}
    >
      {addMenuItems(menuItems)}
    </Menu>
  </SiderLight>
);

SidebarBottomRight.propTypes = {
  onSelect: PropTypes.func.isRequired,
  ...Layout.Sider.propTypes
};

export default SidebarBottomRight;
