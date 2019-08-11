import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconAddDebug } from 'images/no-fill/add-debug.svg';

import { RIGHT_SIDEBAR_NAMES } from 'constants/sidebar-names';

import {
  AddPipeline,
  AddAlgorithmForm,
  AddDebug,
  ErrorLogsTable
} from 'components/Layout/SidebarRight';

import useErrorLogs from './useErrorLogs.react';
import { NodeStatistics } from 'components/tables';
import { STATE_SOURCES } from 'reducers/root.reducer';

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

const mapBySize = node => node.size;
const sumArr = (total, curr) => total + curr;
const flatAllStats = nodeArr => nodeArr.map(mapBySize);
const flatByFree = nodeArr =>
  nodeArr.filter(node => node.name === 'free').map(mapBySize);

const getColorStatus = stats => {
  if (!(stats && stats.results)) return '';
  const { results } = stats;
  const algorithmsDataArr = results.map(r => r.algorithmsData);
  console.log(results);
  const totalSize = algorithmsDataArr.flatMap(flatAllStats).reduce(sumArr);
  const freeSize = algorithmsDataArr.flatMap(flatByFree).reduce(sumArr);

  const freePresents = freeSize / totalSize;
  const isWarningStatus = 0 < freePresents && freePresents <= 0.15;
  const isErrorStatus = freePresents === 0;

  return isWarningStatus ? 'warning' : isErrorStatus ? 'error' : '';
};

const useRightSidebar = () => {
  const [drawerValue, setDrawerValue] = useState(
    RIGHT_SIDEBAR_NAMES.ADD_PIPELINE
  );
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const toggleDrawerVisible = useCallback(() => setDrawerIsVisible(p => !p), [
    setDrawerIsVisible
  ]);

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
  const cpuStatusRef = useRef('');
  const memoryStatusRef = useRef('');

  const [cpuStats, memoryStats] = useSelector(
    state => state[STATE_SOURCES.NODE_STATISTICS].dataSource
  );

  useEffect(
    () => {
      cpuStatusRef.current = getColorStatus(cpuStats);
      memoryStatusRef.current = getColorStatus(memoryStats);
    },
    [cpuStats, memoryStats]
  );

  const menuBottomRightItems = [
    {
      name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
      type: 'warning',
      count: totalNewWarnings
    },
    {
      name: RIGHT_SIDEBAR_NAMES.CPU,
      type: 'cluster',
      status: cpuStatusRef.current
    },
    {
      name: RIGHT_SIDEBAR_NAMES.MEMORY,
      type: 'hdd',
      status: memoryStatusRef.current
    }
  ];

  const onSelectDrawer = useCallback(
    selection => {
      if (selection === RIGHT_SIDEBAR_NAMES.ERROR_LOGS) setIsCleared(true);
      setDrawerValue(selection);
      toggleDrawerVisible();
    },
    [setIsCleared, toggleDrawerVisible]
  );

  return {
    selector: operationSelector,
    onSelect: onSelectDrawer,
    value: [drawerValue, setDrawerValue],
    isCollapsed: [drawerIsVisible, setDrawerIsVisible],
    menus: {
      menuBottomRightItems,
      menuItems
    }
  };
};

export default useRightSidebar;
