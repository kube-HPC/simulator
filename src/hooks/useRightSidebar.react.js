import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import {
  AddPipeline,
  AddAlgorithmForm,
  AddDebug,
  ErrorLogsTable,
  RunRawPipeline,
  IconAddPipeline,
  IconAddAlgorithm,
  IconAddDebug,
  IconRawFile
} from 'components/Sidebar/SidebarRight';

import { useErrorLogs } from 'hooks';
import { NodeStatistics } from 'components';
import { STATE_SOURCES, RIGHT_SIDEBAR_NAMES } from 'const';

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
  },
  {
    name: RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE,
    component: IconRawFile
  }
];

const mapBySize = node => node.size;
const sumArr = (total, curr) => total + curr;
const flatAllStats = nodeArr => nodeArr.map(mapBySize);
const flatByFree = nodeArr => nodeArr.filter(node => node.name === 'free').map(mapBySize);

const getColorStatus = stats => {
  if (!(stats && stats.results)) return '';
  const { results } = stats;
  const algorithmsDataArr = results.map(r => r.algorithmsData);
  const totalSize = algorithmsDataArr.flatMap(flatAllStats).reduce(sumArr);
  const freeSize = algorithmsDataArr.flatMap(flatByFree).reduce(sumArr);

  const freePresents = freeSize / totalSize;
  const isWarningStatus = 0 < freePresents && freePresents <= 0.15;
  const isErrorStatus = freePresents === 0;

  return isWarningStatus ? 'warning' : isErrorStatus ? 'error' : '';
};

const useRightSidebar = () => {
  const [drawerValue, setDrawerValue] = useState(RIGHT_SIDEBAR_NAMES.ADD_PIPELINE);
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const toggleDrawerVisible = useCallback(() => setDrawerIsVisible(p => !p), [setDrawerIsVisible]);

  const operationSelector = {
    [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline onSubmit={toggleDrawerVisible} />,
    [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithmForm onSubmit={toggleDrawerVisible} />,
    [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug onSubmit={toggleDrawerVisible} />,
    [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline onSubmit={toggleDrawerVisible} />,
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

  useEffect(() => {
    cpuStatusRef.current = getColorStatus(cpuStats);
    memoryStatusRef.current = getColorStatus(memoryStats);
  }, [cpuStats, memoryStats]);

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
