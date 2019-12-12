import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon, Menu, Badge } from 'antd';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const MenuMemo = React.memo(Menu);
const MenuItemMemo = React.memo(Menu.Item);
const BadgeMemo = React.memo(Badge);
const IconMemo = React.memo(Icon);
const SiderMemo = React.memo(SiderLight);

const addMenuItems = items =>
  items.map(({ name, type, component, count, status }) => (
    <MenuItemMemo key={name} title={name}>
      <BadgeMemo status={status} count={count} overflowCount={100} offset={[0, 11]}>
        <IconMemo type={type} component={component} style={centerIconStyle} />
      </BadgeMemo>
    </MenuItemMemo>
  ));

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ onSelect, menuItems, ...props }) => {
  const menuSelect = useCallback(({ key }) => onSelect(key), [onSelect]);
  const items = useMemo(() => addMenuItems(menuItems), [menuItems]);

  return (
    <SiderMemo {...props} theme="light" collapsed={true} collapsedWidth={60}>
      <MenuMemo mode="vertical" onSelect={menuSelect} style={topMargin} selectedKeys={noItemSelect}>
        {items}
      </MenuMemo>
    </SiderMemo>
  );
};

export default React.memo(SidebarRight);

SidebarRight.propTypes = {
  onSelect: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
  ...Layout.Sider.propTypes,
};
