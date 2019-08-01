import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconAddDebug } from 'images/no-fill/add-debug.svg';

import { Layout, Icon, Menu } from 'antd';

import { COLOR_LAYOUT } from 'constants/colors';

const SiderLight = styled(Layout.Sider)`
  border-left: 1px solid ${COLOR_LAYOUT.border};
`;

const StyledItem = styled(Menu.Item)`
  margin-left: -16px;
  margin-top: 20px;
`;

const menuItems = [
  ['Add Pipeline', IconAddPipeline],
  ['Add Algorithm', IconAddAlgorithm],
  ['Add Debug', IconAddDebug]
];

const addMenuItems = items =>
  items.map(([name, component]) => (
    <StyledItem key={name}>
      <Icon
        type={component}
        component={component}
        style={{ fontSize: '25px' }}
      />
      <span>{name}</span>
    </StyledItem>
  ));

export default function SidebarOperations({ onSelect, ...props }) {
  return (
    <SiderLight {...props} theme="light" collapsed={true} collapsedWidth={60}>
      <Menu
        mode="vertical"
        onSelect={i => onSelect(i.key)}
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
