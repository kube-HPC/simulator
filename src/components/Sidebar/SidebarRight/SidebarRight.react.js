import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon, Menu, Badge } from 'antd';
import { useRightSidebar } from 'hooks';

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

const SidebarRight = ({ isTop = false, className }) => {
  const {
    onSelect,
    menus: { top, bottom },
  } = useRightSidebar();

  const menuSelect = useCallback(({ key }) => onSelect(key), [onSelect]);
  const items = useMemo(() => addMenuItems(isTop ? top : bottom), []);

  return (
    <SiderMemo className={className} theme="light" collapsed={true} collapsedWidth={60}>
      <MenuMemo mode="vertical" onSelect={menuSelect} style={topMargin} selectedKeys={noItemSelect}>
        {items}
      </MenuMemo>
    </SiderMemo>
  );
};

SidebarRight.propTypes = {
  isTop: PropTypes.bool,
  className: PropTypes.string,
  ...Layout.Sider.propTypes,
};

export default React.memo(SidebarRight);
