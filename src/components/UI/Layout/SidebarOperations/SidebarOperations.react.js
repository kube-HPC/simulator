import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Layout, Icon, Menu, Badge } from 'antd';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const addMenuItems = items =>
  items.map(({ name, type, component, count }) => (
    <Menu.Item key={name} title={name}>
      <Badge count={count} overflowCount={100} offset={[0, 11]}>
        <Icon type={type} component={component} style={centerIconStyle} />
      </Badge>
    </Menu.Item>
  ));

const SidebarOperations = ({ onSelect, menuItems, ...props }) => (
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
