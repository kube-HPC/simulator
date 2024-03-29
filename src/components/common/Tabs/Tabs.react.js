import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';

const tabsAnimation = { inkBar: false, tabPane: false };

const Tabs = ({ children, extra, onTabClick, ...props }) => (
  <AntTabs
    animated={tabsAnimation}
    tabBarExtraContent={extra}
    onTabClick={onTabClick}
    {...props}>
    {children}
  </AntTabs>
);

const TabPane = ({ children, key, label }) => [
  {
    label,
    key,
    children,
  },
];

Tabs.TabPane = TabPane;
Tabs.propTypes = {
  ...AntTabs.propTypes,
  /* eslint-disable */
  extra: PropTypes.node,
  onTabClick: PropTypes.func,
  /* eslint-enable */
};
TabPane.propTypes = AntTabs.TabPane.propTypes;

export default Tabs;
