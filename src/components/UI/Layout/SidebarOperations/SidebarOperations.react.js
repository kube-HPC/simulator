import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconAddDebug } from 'images/no-fill/add-debug.svg';

import { Layout, Icon, Menu } from 'antd';

import { COLOR_LAYOUT } from 'constants/colors';

const SiderLight = styled(Layout.Sider)`
  border: none;
`;

const menuItems = [
  ['Add Pipeline', IconAddPipeline],
  ['Add Algorithm', IconAddAlgorithm],
  ['Add Debug', IconAddDebug]
];

const addMenuItems = items =>
  items.map(([name, component]) => (
    <Menu.Item key={name}>
      <Icon
        type={component}
        component={component}
        style={{ fontSize: '25px', marginLeft: '-14px' }}
      />
      <span>{name}</span>
    </Menu.Item>
  ));

export default function SidebarOperations({
  selectedKeys,
  onSelect,
  ...props
}) {
  return (
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
}

SidebarOperations.propTypes = {
  onSelect: PropTypes.func.isRequired
};
