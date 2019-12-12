import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  AddPipeline,
  AddAlgorithm,
  AddDebug,
  ErrorLogsTable,
  RunRawPipeline,
  IconAddPipeline,
  IconAddAlgorithm,
  IconAddDebug,
  IconRawFile,
} from 'components/Sidebar/SidebarRight';

import { useErrorLogs } from 'hooks';
import { NodeStatistics } from 'components';
import { STATE_SOURCES, RIGHT_SIDEBAR_NAMES } from 'const';
import { CONTENT_CONFIG } from 'components/Drawer';
import useActions from './useActions';

const top = [
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
    component: IconAddPipeline,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
    component: IconAddAlgorithm,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DEBUG,
    component: IconAddDebug,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE,
    component: IconRawFile,
  },
];

const mapBySize = node => node.size;
const sumArr = (total, curr) => total + curr;
const flatAllStats = nodeArr => nodeArr.map(mapBySize);
const flatByFree = nodeArr => nodeArr.filter(node => node.name === 'free').map(mapBySize);

const getColorStatus = stats => {
  if (!(stats && stats.results)) {
    return '';
  }
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
  const { totalNewWarnings, setIsCleared } = useErrorLogs();
  const cpuStatusRef = useRef('');
  const memoryStatusRef = useRef('');

  const operationSelector = useMemo(
    () => ({
      [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline />,
      [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithm />,
      [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug />,
      [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline />,
      [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
      [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
      [RIGHT_SIDEBAR_NAMES.MEMORY]: <NodeStatistics metric="mem" />,
    }),
    [],
  );

  const {
    dataSource: [cpuStats, memoryStats],
  } = useSelector(state => state[STATE_SOURCES.NODE_STATISTICS]);

  useEffect(() => {
    cpuStatusRef.current = getColorStatus(cpuStats);
    memoryStatusRef.current = getColorStatus(memoryStats);
  }, [cpuStats, memoryStats]);

  const bottom = [
    {
      name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
      type: 'warning',
      count: totalNewWarnings,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.CPU,
      type: 'cluster',
      status: cpuStatusRef.current,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.MEMORY,
      type: 'hdd',
      status: memoryStatusRef.current,
    },
  ];

  const { drawerOpen } = useActions();

  const onSelectDrawer = useCallback(
    selection => {
      if (selection === RIGHT_SIDEBAR_NAMES.ERROR_LOGS) {
        setIsCleared(true);
      }
      const { width } = CONTENT_CONFIG[selection];

      const content = {
        width,
        body: operationSelector[selection],
      };
      drawerOpen(content);
    },
    [setIsCleared, drawerOpen, operationSelector],
  );

  return {
    onSelect: onSelectDrawer,
    menus: {
      top,
      bottom,
    },
  };
};

export default useRightSidebar;
