import React, { useState } from 'react';

import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconAddDebug } from 'images/no-fill/add-debug.svg';

import { RIGHT_SIDEBAR_NAMES } from 'constants/sidebar-names';
import { makeToggle } from 'utils/hooks';

import {
  AddPipeline,
  AddAlgorithmForm,
  AddDebug,
  ErrorLogsTable
} from 'components/Layout/SidebarRight';

import useErrorLogs from './useErrorLogs.react';
import { NodeStatistics } from 'components/tables';

const menuItems = [
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
    component: IconAddPipeline
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
    component: IconAddAlgorithm
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DEBUG,
    component: IconAddDebug
  }
];

const useRightSidebar = () => {
  const [drawerValue, setDrawerValue] = useState(
    RIGHT_SIDEBAR_NAMES.ADD_PIPELINE
  );
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const toggleDrawerVisible = makeToggle(setDrawerIsVisible);

  const operationSelector = {
    [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: (
      <AddPipeline onSubmit={toggleDrawerVisible} />
    ),
    [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: (
      <AddAlgorithmForm onSubmit={toggleDrawerVisible} />
    ),
    [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: (
      <AddDebug onSubmit={toggleDrawerVisible} />
    ),
    [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
    [RIGHT_SIDEBAR_NAMES.MEMORY]: <NodeStatistics metric="mem" />,
    [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />
  };

  const { totalNewWarnings, setIsCleared } = useErrorLogs();
  const menuBottomRightItems = [
    {
      name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
      type: 'warning',
      count: totalNewWarnings
    },
    {
      name: RIGHT_SIDEBAR_NAMES.CPU,
      type: 'cluster'
    },
    {
      name: RIGHT_SIDEBAR_NAMES.MEMORY,
      type: 'hdd'
    }
  ];

  const onSelectDrawer = selection => {
    if (selection === RIGHT_SIDEBAR_NAMES.ERROR_LOGS) {
      setIsCleared(true);
    }
    setDrawerValue(selection);
    toggleDrawerVisible();
  };

  return {
    selector: operationSelector,
    onSelect: onSelectDrawer,
    value: [drawerValue, setDrawerValue],
    isCollapsed: [drawerIsVisible, setDrawerIsVisible],
    toggle: toggleDrawerVisible,
    menus: {
      menuBottomRightItems,
      menuItems
    }
  };
};

export default useRightSidebar;
