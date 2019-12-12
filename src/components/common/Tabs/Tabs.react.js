import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';

const tabsAnimation = { inkBar: false, tabPane: false };

const Tabs = ({ children, extra, onTabClick, ...props }) => (
  <AntTabs animated={tabsAnimation} tabBarExtraContent={extra} onTabClick={onTabClick} {...props}>
    {children}
  </AntTabs>
);

const TabPane = ({ children, ...props }) => (
  <AntTabs.TabPane {...props}>{children}</AntTabs.TabPane>
);

Tabs.TabPane = TabPane;
Tabs.propTypes = {
  ...AntTabs.propTypes,
  extra: PropTypes.node,
  onTabClick: PropTypes.func,
};
TabPane.propTypes = AntTabs.TabPane.propTypes;

export default Tabs;
