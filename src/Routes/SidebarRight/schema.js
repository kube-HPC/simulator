import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconRawFile } from 'images/raw.svg';
import { ReactComponent as IconDataSource } from 'images/datasource.svg';
import { ReactComponent as WorkerIcon } from 'images/worker-icon.svg';
import { ReactComponent as DriversIcon } from 'images/drivers-icon.svg';

import { RIGHT_SIDEBAR_NAMES } from 'const';
import {
  WarningOutlined,
  ClusterOutlined,
  FundOutlined,
  HddOutlined,
} from '@ant-design/icons';

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
];

export const getBottomActions = ({
  warnings,
  cpuStatus,
  memoryStatus,
  gpuStatus,
}) => {
  const ret = [
    {
      name: RIGHT_SIDEBAR_NAMES.WORKERS,
      component: WorkerIcon,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.DRIVERS,
      component: DriversIcon,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.ERROR_LOGS,
      count: warnings,
      component: WarningOutlined,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.CPU,
      status: cpuStatus.status,
      component: ClusterOutlined,
    },
    {
      name: RIGHT_SIDEBAR_NAMES.MEMORY,
      status: memoryStatus.status,
      component: HddOutlined,
    },
  ];
  if (gpuStatus.total) {
    ret.push({
      name: RIGHT_SIDEBAR_NAMES.GPU,
      component: FundOutlined,
      status: gpuStatus.status,
    });
  }
  return ret;
};
