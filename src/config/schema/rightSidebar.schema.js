import {
  IconAddAlgorithm,
  IconAddDebug,
  IconAddPipeline,
  IconRawFile,
} from 'components/Sidebar/SidebarRight';
import { RIGHT_SIDEBAR_NAMES } from 'const';

export const topActions = [
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

export const getBottomActions = ({ warnings, cpuStatus, memoryStatus }) => [
  {
    name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
    type: 'warning',
    count: warnings,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.CPU,
    type: 'cluster',
    status: cpuStatus,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.MEMORY,
    type: 'hdd',
    status: memoryStatus,
  },
];
