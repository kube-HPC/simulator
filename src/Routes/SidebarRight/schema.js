import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconRawFile } from 'images/raw.svg';
import { ReactComponent as IconDataSource } from 'images/datasource.svg';
import { ReactComponent as IconDevenv } from 'images/code-icon.svg';

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
    name: RIGHT_SIDEBAR_NAMES.RUN_RAW_PIPELINE,
    component: IconRawFile,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE,
    component: IconDataSource,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DEVENV,
    component: IconDevenv,
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
