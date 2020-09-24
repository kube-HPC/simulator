import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Icon, Menu, Badge } from 'antd';
import { useRightSidebar } from 'hooks';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const centerIconStyle = { fontSize: '25px', marginLeft: '-14px' };

const topMargin = { marginTop: '20%' };
const noItemSelect = [];

const SidebarRight = ({ isTop, className }) => {
  const {
    onSelect,
    menus: { top, bottom },
  } = useRightSidebar();

  const menuSelect = useCallback(({ key }) => onSelect(key), [onSelect]);

  return (
    <SiderLight
      className={className}
      theme="light"
      collapsedWidth={60}
      collapsed>
      <Menu
        mode="vertical"
        onSelect={menuSelect}
        style={topMargin}
        selectedKeys={noItemSelect}>
        {(isTop ? top : bottom).map(
          ({ name, type, component, count, status }) => (
            <Menu.Item key={name} title={name}>
              <Badge
                status={status}
                count={count}
                overflowCount={100}
                offset={[0, 11]}>
                <Icon
                  type={type}
                  component={component}
                  style={centerIconStyle}
                />
              </Badge>
            </Menu.Item>
          )
        )}
      </Menu>
    </SiderLight>
  );
};

SidebarRight.propTypes = {
  isTop: PropTypes.bool,
  className: PropTypes.string,
  ...Layout.Sider.propTypes,
};

SidebarRight.defaultProps = {
  isTop: false,
  className: '',
};

export default SidebarRight;
