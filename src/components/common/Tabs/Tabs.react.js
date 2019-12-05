import React from 'react';
import { Tabs as AntTabs } from 'antd';

const tabsAnimation = { inkBar: false, tabPane: false };

const Tabs = ({ children, ...props }) => (
  <AntTabs animated={tabsAnimation} {...props}>
    {children}
  </AntTabs>
);

const TabPane = ({ children, ...props }) => (
  <AntTabs.TabPane {...props}>{children}</AntTabs.TabPane>
);

Tabs.TabPane = TabPane;
Tabs.propTypes = AntTabs.propTypes;
TabPane.propTypes = AntTabs.TabPane.propTypes;

export default Tabs;
