import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconAddDebug } from 'images/no-fill/add-debug.svg';
import { ReactComponent as IconRawFile } from 'images/raw.svg';

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

export const getBottomActions = ({
  warnings,
  cpuStatus,
  memoryStatus,
  gpuStatus,
}) => {
  const ret = [
    {
      name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
      type: 'warning',
      count: warnings,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.CPU,
      type: 'cluster',
      status: cpuStatus.status,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.MEMORY,
      type: 'hdd',
      status: memoryStatus.status,
    },
  ];
  if (gpuStatus.total) {
    ret.push({
      name: RIGHT_SIDEBAR_NAMES.GPU,
      type: 'fund',
      status: gpuStatus.status,
    });
  }
  return ret;
};
