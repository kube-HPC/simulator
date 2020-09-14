import { NodeStatistics } from 'components';
import { CONTENT_CONFIG } from 'components/Drawer';
import {
  AddAlgorithm,
  AddDebug,
  AddPipeline,
  ErrorLogsTable,
  RunRawPipeline,
  DiskSpace,
} from 'components/Sidebar/SidebarRight';
import { getBottomActions, topActions } from 'config/schema/rightSidebar.schema';
import { RIGHT_SIDEBAR_NAMES } from 'const';
import { useErrorLogs } from 'hooks';
import React, { useCallback, useMemo } from 'react';
import { getColorStatus, getDiskSpaceColorStatus } from 'utils/warningColorStatus';
import useActions from './useActions';
import useStats from './useStats';
import useDiskSpace from './useDiskSpace';

const useRightSidebar = () => {
  const { totalNewWarnings, setIsCleared } = useErrorLogs();
  const { cpu, memory, gpu } = useStats();
  const { diskSpace } = useDiskSpace();

  const { drawerOpen } = useActions();

  // Using Redux-hooks, must be in scope
  const operationSelector = useMemo(
    () => ({
      [RIGHT_SIDEBAR_NAMES.ADD_PIPELINE]: <AddPipeline />,
      [RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM]: <AddAlgorithm />,
      [RIGHT_SIDEBAR_NAMES.ADD_DEBUG]: <AddDebug />,
      [RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE]: <RunRawPipeline />,
      [RIGHT_SIDEBAR_NAMES.ERROR_LOGS]: <ErrorLogsTable />,
      [RIGHT_SIDEBAR_NAMES.DISK]: <DiskSpace />,
      [RIGHT_SIDEBAR_NAMES.CPU]: <NodeStatistics metric="cpu" />,
      [RIGHT_SIDEBAR_NAMES.MEMORY]: <NodeStatistics metric="mem" />,
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
        diskSpace: getDiskSpaceColorStatus(diskSpace),
        cpuStatus: getColorStatus(cpu),
        memoryStatus: getColorStatus(memory),
        gpuStatus: getColorStatus(gpu),
      }),
    },
  };
};

export default useRightSidebar;
