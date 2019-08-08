import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEqual } from 'lodash';

import { Layout, Icon, Menu, Badge } from 'antd';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const MenuItem = React.memo(Menu.Item, isEqual);

const addMenuItems = items =>
  items.map(({ name, type, component, count, status }) => (
    <MenuItem key={name} title={name}>
      <Badge status={status} count={count} overflowCount={100} offset={[0, 11]}>
        <Icon type={type} component={component} style={centerIconStyle} />
      </Badge>
    </MenuItem>
  ));

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ onSelect, menuItems, ...props }) => {
  const menuSelect = useCallback(({ key }) => onSelect(key), [onSelect]);
  const items = useMemo(() => addMenuItems(menuItems), [menuItems]);

  return (
    <SiderLight {...props} theme="light" collapsed={true} collapsedWidth={60}>
      <Menu
        mode="vertical"
        onSelect={menuSelect}
        style={topMargin}
        selectedKeys={noItemSelect}
      >
        {items}
      </Menu>
    </SiderLight>
  );
};

export default React.memo(SidebarRight, isEqual);
// SidebarRight.whyDidYouRender = true;

SidebarRight.propTypes = {
  onSelect: PropTypes.func.isRequired
};
