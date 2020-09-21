import { CONTENT_CONFIG } from 'components/Drawer';
import {
  AddAlgorithm,
  AddDebug,
  AddPipeline,
  ErrorLogsTable,
  RunRawPipeline,
  MemoryAndStorage,
  NodeStatistics,
} from 'components/Sidebar/SidebarRight';
import { getBottomActions, topActions } from 'config/schema/rightSidebar.schema';
import { RIGHT_SIDEBAR_NAMES } from 'const';
import { useErrorLogs } from 'hooks';
import React, { useCallback, useMemo } from 'react';
import { getColorStatus, getStorageColorStatus, combineStatus } from 'utils/warningColorStatus';
import useActions from './useActions';
import useStats from './useStats';
import useStorage from './useStorage';

const useRightSidebar = () => {
  const { totalNewWarnings, setIsCleared } = useErrorLogs();
  const { cpu, memory, gpu } = useStats();
  const { storage } = useStorage();
  const { drawerOpen } = useActions();

  // Using Redux-hooks, must be in scope
  const operationSelector = useMemo(
    () => ({
      [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline />,
      [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithm />,
      [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug />,
      [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline />,
      [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
      [RIGHT_SIDEBAR_NAMES.MEMORY]: <MemoryAndStorage />,
      [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
      [RIGHT_SIDEBAR_NAMES.GPU]: <NodeStatistics metric="gpu" />,
    }),
    [],
  );
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
    [operationSelector, drawerOpen, setIsCleared],
  );

  return {
    onSelect: onSelectDrawer,
    menus: {
      top: topActions,
      bottom: getBottomActions({
        warnings: totalNewWarnings,
        cpuStatus: getColorStatus(cpu),
        memoryStatus: combineStatus(getColorStatus(memory), getStorageColorStatus(storage)),
        gpuStatus: getColorStatus(gpu),
      }),
    },
  };
};

export default useRightSidebar;
